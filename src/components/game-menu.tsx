"use client";

import { motion } from "framer-motion";
import { useBirthdayStore, type GameId } from "@/lib/store";

const GAMES: { id: GameId; name: string; icon: string; desc: string }[] = [
  {
    id: "memory",
    name: "Memory Match",
    icon: "🧠",
    desc: "Find the matching pairs",
  },
  {
    id: "guess-year",
    name: "Guess the Year",
    icon: "📅",
    desc: "When was this photo taken?",
  },
  {
    id: "trivia",
    name: "Cuki Trivia",
    icon: "❓",
    desc: "How well do you know her?",
  },
  {
    id: "puzzle",
    name: "Sliding Puzzle",
    icon: "🧩",
    desc: "Solve the picture puzzle",
  },
];

export function GameMenu() {
  const { startGame, completedGames } = useBirthdayStore();

  return (
    <div className="grid grid-cols-2 gap-3">
      {GAMES.map((game) => {
        const completed = completedGames.includes(game.id);

        return (
          <motion.button
            key={game.id}
            className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-colors ${
              completed
                ? "border-green-300 bg-green-50 opacity-70"
                : "border-cookie-light bg-white hover:border-gold hover:bg-gold/5"
            }`}
            onClick={() => !completed && startGame(game.id)}
            disabled={completed}
            whileHover={completed ? {} : { scale: 1.03 }}
            whileTap={completed ? {} : { scale: 0.97 }}
          >
            <span className="text-2xl">{completed ? "✅" : game.icon}</span>
            <span className="font-semibold text-sm text-cookie-dark">
              {game.name}
            </span>
            <span className="text-xs text-cookie-dark/50">{game.desc}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
