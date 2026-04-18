"use client";

import { motion } from "framer-motion";
import { useBirthdayStore, type GameId } from "@/lib/store";

const GAMES: { id: GameId; name: string; icon: string; desc: string }[] = [
  {
    id: "memory",
    name: "Memoria",
    icon: "🧠",
    desc: "Encontrá las parejas",
  },
  {
    id: "guess-year",
    name: "Adiviná el Año",
    icon: "📅",
    desc: "¿Cuándo se tomó esta foto?",
  },
  {
    id: "trivia",
    name: "Trivia de Cuki",
    icon: "❓",
    desc: "¿Qué tanto la conocés?",
  },
  {
    id: "puzzle",
    name: "Rompecabezas",
    icon: "🧩",
    desc: "Resolvé el puzzle",
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
