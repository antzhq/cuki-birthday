"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Phase =
  | "landing"
  | "blowing"
  | "video"
  | "gallery"
  | "game"
  | "complete";

export type GameId = "memory" | "guess-year" | "trivia" | "puzzle";

interface BirthdayState {
  phase: Phase;
  activeGame: GameId | null;
  candlesLit: number;
  unlockedPhotos: number[];
  completedGames: GameId[];

  setPhase: (phase: Phase) => void;
  blowCandle: () => void;
  blowAllCandles: () => void;
  startGame: (game: GameId) => void;
  completeGame: (game: GameId) => void;
  exitGame: () => void;
  relightCandles: () => void;
}

// WHY: Each game unlocks a group of photos (indices 0-12, 13 total).
// First game gets 4, rest get 3 each. Completing all 4 = all 13 unlocked.
const GAME_PHOTO_MAP: Record<GameId, number[]> = {
  memory: [0, 1, 2, 3],
  "guess-year": [4, 5, 6],
  trivia: [7, 8, 9],
  puzzle: [10, 11, 12],
};

export const useBirthdayStore = create<BirthdayState>()(
  persist(
    (set, get) => ({
      phase: "landing",
      activeGame: null,
      candlesLit: 18,
      unlockedPhotos: [],
      completedGames: [],

      setPhase: (phase) => set({ phase }),

      blowCandle: () => {
        const current = get().candlesLit;
        if (current <= 1) {
          set({ candlesLit: 0, phase: "video" });
        } else {
          set({ candlesLit: current - 1 });
        }
      },

      blowAllCandles: () => {
        set({ candlesLit: 0, phase: "video" });
      },

      startGame: (game) => set({ activeGame: game, phase: "game" }),

      completeGame: (game) => {
        const { completedGames, unlockedPhotos } = get();
        if (completedGames.includes(game)) return;

        const newPhotos = GAME_PHOTO_MAP[game];
        const updated = [...new Set([...unlockedPhotos, ...newPhotos])];
        const updatedGames = [...completedGames, game];

        set({
          completedGames: updatedGames,
          unlockedPhotos: updated,
          activeGame: null,
          phase: updatedGames.length === 4 ? "complete" : "gallery",
        });
      },

      exitGame: () => set({ activeGame: null, phase: "gallery" }),

      relightCandles: () =>
        set({ candlesLit: 18, phase: "landing" }),
    }),
    {
      name: "cuki-birthday-state",
    }
  )
);
