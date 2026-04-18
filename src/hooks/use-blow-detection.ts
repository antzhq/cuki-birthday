"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface UseBlowDetectionOptions {
  threshold?: number;
  onBlow: () => void;
  enabled?: boolean;
}

export function useBlowDetection({
  threshold = 130,
  onBlow,
  enabled = true,
}: UseBlowDetectionOptions) {
  const [micActive, setMicActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const cooldownRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);

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
      setMicActive(true);
    } catch {
      setPermissionDenied(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled || !micActive || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const detect = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      if (average > threshold && !cooldownRef.current) {
        cooldownRef.current = true;
        onBlow();
        // WHY: Cooldown prevents one sustained blow from triggering multiple events
        setTimeout(() => {
          cooldownRef.current = false;
        }, 500);
      }

      animFrameRef.current = requestAnimationFrame(detect);
    };

    animFrameRef.current = requestAnimationFrame(detect);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [enabled, micActive, threshold, onBlow]);

  // Cleanup mic on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { micActive, permissionDenied, startMic };
}
