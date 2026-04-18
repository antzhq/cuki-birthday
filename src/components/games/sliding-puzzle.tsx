"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useBirthdayStore } from "@/lib/store";
import { UnlockAnimation } from "../unlock-animation";

const SIZE = 3;
const TOTAL_TILES = SIZE * SIZE;
const EMPTY = TOTAL_TILES - 1;

function createSolvedBoard(): number[] {
  return Array.from({ length: TOTAL_TILES }, (_, i) => i);
}

function isSolvable(board: number[]): boolean {
  let inversions = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = i + 1; j < board.length; j++) {
      if (board[i] !== EMPTY && board[j] !== EMPTY && board[i] > board[j]) {
        inversions++;
      }
    }
  }
  // WHY: For odd-sized grids, solvable if inversions is even
  return inversions % 2 === 0;
}

function shuffleBoard(): number[] {
  let board: number[];
  do {
    board = createSolvedBoard();
    for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [board[i], board[j]] = [board[j], board[i]];
    }
  } while (!isSolvable(board) || isSolved(board));
  return board;
}

function isSolved(board: number[]): boolean {
  return board.every((val, idx) => val === idx);
}

function getAdjacentToEmpty(board: number[]): number[] {
  const emptyIdx = board.indexOf(EMPTY);
  const row = Math.floor(emptyIdx / SIZE);
  const col = emptyIdx % SIZE;
  const adjacent: number[] = [];

  if (row > 0) adjacent.push(emptyIdx - SIZE);
  if (row < SIZE - 1) adjacent.push(emptyIdx + SIZE);
  if (col > 0) adjacent.push(emptyIdx - 1);
  if (col < SIZE - 1) adjacent.push(emptyIdx + 1);

  return adjacent;
}

// WHY: Cookie emoji pieces as the puzzle image — no external image dependency
const TILE_EMOJIS = ["🍪", "🎂", "🎁", "🎈", "⭐", "💖", "🌸", "🦋"];

export function SlidingPuzzle() {
  const { completeGame, exitGame } = useBirthdayStore();
  const [board, setBoard] = useState<number[]>(shuffleBoard);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);

  useEffect(() => {
    if (isSolved(board) && moves > 0) {
      setSolved(true);
      setTimeout(() => setShowUnlock(true), 1000);
    }
  }, [board, moves]);

  const handleTileClick = useCallback(
    (index: number) => {
      if (solved) return;
      const emptyIdx = board.indexOf(EMPTY);
      const adjacent = getAdjacentToEmpty(board);

      if (adjacent.includes(index)) {
        const newBoard = [...board];
        [newBoard[index], newBoard[emptyIdx]] = [
          newBoard[emptyIdx],
          newBoard[index],
        ];
        setBoard(newBoard);
        setMoves((m) => m + 1);
      }
    },
    [board, solved]
  );

  if (showUnlock) {
    return (
      <UnlockAnimation count={3} onDone={() => completeGame("puzzle")} />
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-4 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between w-full">
        <button
          className="text-sm text-cookie-dark/50 hover:text-cookie-dark"
          onClick={exitGame}
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold text-cookie-dark">
          🧩 Sliding Puzzle
        </h2>
        <span className="text-sm text-cookie-dark/50">{moves} moves</span>
      </div>

      <p className="text-sm text-cookie-dark/60">
        Tap a tile next to the empty space to slide it!
      </p>

      <div
        className="grid gap-1 w-full max-w-xs mx-auto"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
      >
        {board.map((tile, index) => {
          const isEmptyTile = tile === EMPTY;
          const isAdjacent = getAdjacentToEmpty(board).includes(index);

          return (
            <motion.button
              key={tile}
              className={`aspect-square rounded-lg text-2xl flex items-center justify-center font-bold transition-colors ${
                isEmptyTile
                  ? "bg-transparent"
                  : isAdjacent
                  ? "bg-cookie-light border-2 border-gold cursor-pointer hover:bg-gold/20"
                  : "bg-cookie-light border-2 border-cookie-brown/20"
              }`}
              onClick={() => handleTileClick(index)}
              disabled={isEmptyTile}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {!isEmptyTile && TILE_EMOJIS[tile]}
            </motion.button>
          );
        })}
      </div>

      {solved && (
        <motion.p
          className="text-lg font-bold text-green-600"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🎉 Solved in {moves} moves!
        </motion.p>
      )}
    </motion.div>
  );
}
