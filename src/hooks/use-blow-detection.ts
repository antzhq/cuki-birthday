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
  // WHY: Phone mic blowing registers as low-amplitude broadband noise.
  // 15 is very sensitive — even a gentle blow should trigger it.
  threshold = 15,
}: UseBlowDetectionOptions) {
  const [micState, setMicState] = useState<"idle" | "active" | "denied">("idle");
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const cooldownRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const onBlowRef = useRef(onBlow);

  useEffect(() => {
    onBlowRef.current = onBlow;
  }, [onBlow]);

  const startMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // WHY: Disable noise suppression and auto gain — they filter out
          // exactly the kind of broadband noise that blowing produces
          noiseSuppression: false,
          autoGainControl: false,
          echoCancellation: false,
        },
      });
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

  // Detection loop using time-domain data (better for detecting blowing)
  useEffect(() => {
    if (!enabled || micState !== "active" || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.fftSize);

    const detect = () => {
      // WHY: getByteTimeDomainData gives us the raw waveform.
      // Silence is ~128 for each sample. Blowing creates deviations.
      // We measure the average deviation from 128 (RMS-like).
      analyser.getByteTimeDomainData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const deviation = Math.abs(dataArray[i] - 128);
        sum += deviation;
      }
      const average = sum / dataArray.length;

      if (average > threshold && !cooldownRef.current) {
        cooldownRef.current = true;
        onBlowRef.current();
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

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { micState, startMic };
}
