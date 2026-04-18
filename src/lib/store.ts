"use client";

import { create } from "zustand";

type Phase = "cake" | "photos";

interface BirthdayState {
  phase: Phase;
  candlesLit: number;
  musicStarted: boolean;

  startMusic: () => void;
  blowCandle: () => void;
  blowAllCandles: () => void;
  reset: () => void;
}

export const useBirthdayStore = create<BirthdayState>()((set, get) => ({
  phase: "cake",
  candlesLit: 18,
  musicStarted: false,

  startMusic: () => set({ musicStarted: true }),

  blowCandle: () => {
    const current = get().candlesLit;
    if (current <= 1) {
      set({ candlesLit: 0, phase: "photos" });
    } else {
      set({ candlesLit: current - 1 });
    }
  },

  blowAllCandles: () => {
    set({ candlesLit: 0, phase: "photos" });
  },

  reset: () => set({ candlesLit: 18, phase: "cake" }),
}));
