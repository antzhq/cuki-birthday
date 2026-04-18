"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface UseBlowDetectionOptions {
  onBlow: () => void;
  enabled: boolean;
  threshold?: number;
}

export function useBlowDetection({
  onBlow,
  enabled,
  threshold = 120,
}: UseBlowDetectionOptions) {
  const [micState, setMicState] = useState<"idle" | "active" | "denied">("idle");
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const cooldownRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const onBlowRef = useRef(onBlow);

  // WHY: Keep onBlow ref fresh so the RAF loop always calls the latest version
  useEffect(() => {
    onBlowRef.current = onBlow;
  }, [onBlow]);

  const startMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      setMicState("active");
    } catch {
      setMicState("denied");
    }
  }, []);

  // Detection loop
  useEffect(() => {
    if (!enabled || micState !== "active" || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const detect = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      if (average > threshold && !cooldownRef.current) {
        cooldownRef.current = true;
        onBlowRef.current();
        // WHY: 400ms cooldown so one sustained blow doesn't extinguish everything instantly
        setTimeout(() => {
          cooldownRef.current = false;
        }, 400);
      }

      animFrameRef.current = requestAnimationFrame(detect);
    };

    animFrameRef.current = requestAnimationFrame(detect);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [enabled, micState, threshold]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { micState, startMic };
}
