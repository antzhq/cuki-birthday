"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Phase =
  | "landing"
  | "blowing"
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
  hasVisitedGallery: boolean;

  setPhase: (phase: Phase) => void;
  blowCandle: () => void;
  blowAllCandles: () => void;
  startGame: (game: GameId) => void;
  completeGame: (game: GameId) => void;
  exitGame: () => void;
  relightCandles: () => void;
  goToGallery: () => void;
}

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
      hasVisitedGallery: false,

      setPhase: (phase) => set({ phase }),

      blowCandle: () => {
        const current = get().candlesLit;
        if (current <= 1) {
          set({ candlesLit: 0, phase: "gallery", hasVisitedGallery: true });
        } else {
          set({ candlesLit: current - 1 });
        }
      },

      blowAllCandles: () => {
        set({ candlesLit: 0, phase: "gallery", hasVisitedGallery: true });
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
          hasVisitedGallery: true,
        });
      },

      exitGame: () => set({ activeGame: null, phase: "gallery" }),

      relightCandles: () =>
        set({ candlesLit: 18, phase: "landing" }),

      goToGallery: () => {
        const { completedGames } = get();
        set({
          phase: completedGames.length === 4 ? "complete" : "gallery",
          hasVisitedGallery: true,
        });
      },
    }),
    {
      name: "cuki-birthday-state",
    }
  )
);
