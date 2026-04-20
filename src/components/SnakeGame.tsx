/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Direction, GameState, Point } from "../types";

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: "RIGHT",
    score: 0,
    isGameOver: false,
    highScore: 0,
  });
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const lastProcessedDirection = useRef<Direction>("RIGHT");

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some((p) => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState((prev) => ({
      ...prev,
      snake: [{ x: 10, y: 10 }],
      food: generateFood([{ x: 10, y: 10 }]),
      direction: "RIGHT",
      score: 0,
      isGameOver: false,
    }));
    setSpeed(INITIAL_SPEED);
    lastProcessedDirection.current = "RIGHT";
  };

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver) return;

    setGameState((prev) => {
      const head = prev.snake[0];
      const newHead = { ...head };

      switch (prev.direction) {
        case "UP": newHead.y -= 1; break;
        case "DOWN": newHead.y += 1; break;
        case "LEFT": newHead.x -= 1; break;
        case "RIGHT": newHead.x += 1; break;
      }

      // Check collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prev.snake.some((p) => p.x === newHead.x && p.y === newHead.y)
      ) {
        return {
          ...prev,
          isGameOver: true,
          highScore: Math.max(prev.score, prev.highScore),
        };
      }

      const newSnake = [newHead, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;

      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newFood = generateFood(newSnake);
        newScore += 10;
        setSpeed((s) => Math.max(50, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      lastProcessedDirection.current = prev.direction;
      return { ...prev, snake: newSnake, food: newFood, score: newScore };
    });
  }, [gameState.isGameOver, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let nextDir: Direction | null = null;
      switch (e.key) {
        case "ArrowUp": if (lastProcessedDirection.current !== "DOWN") nextDir = "UP"; break;
        case "ArrowDown": if (lastProcessedDirection.current !== "UP") nextDir = "DOWN"; break;
        case "ArrowLeft": if (lastProcessedDirection.current !== "RIGHT") nextDir = "LEFT"; break;
        case "ArrowRight": if (lastProcessedDirection.current !== "LEFT") nextDir = "RIGHT"; break;
      }

      if (nextDir) {
        setGameState((prev) => ({ ...prev, direction: nextDir! }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellWidth = canvas.width / GRID_SIZE;
    const cellHeight = canvas.height / GRID_SIZE;

    // Background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (subtle)
    ctx.strokeStyle = "rgba(0, 255, 255, 0.05)";
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellWidth, 0);
      ctx.lineTo(i * cellWidth, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellHeight);
      ctx.lineTo(canvas.width, i * cellHeight);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = "#ff00ff";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff00ff";
    ctx.fillRect(
      gameState.food.x * cellWidth + 2,
      gameState.food.y * cellHeight + 2,
      cellWidth - 4,
      cellHeight - 4
    );

    // Snake
    gameState.snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? "#00ffff" : "#00cccc";
      ctx.shadowBlur = i === 0 ? 20 : 0;
      ctx.shadowColor = "#00ffff";
      ctx.fillRect(
        p.x * cellWidth + 1,
        p.y * cellHeight + 1,
        cellWidth - 2,
        cellHeight - 2
      );
    });

    if (gameState.isGameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ff00ff";
      ctx.shadowBlur = 10;
      ctx.font = "bold 24px 'VT323', monospace";
      ctx.textAlign = "center";
      ctx.fillText("SYSTEM FAILURE", canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = "16px 'VT323', monospace";
      ctx.fillText("PRESS R TO REBOOT", canvas.width / 2, canvas.height / 2 + 20);
    }
  }, [gameState]);

  // Handle R key for reset
  useEffect(() => {
    const handleReset = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r" && gameState.isGameOver) {
        resetGame();
      }
    };
    window.addEventListener("keydown", handleReset);
    return () => window.removeEventListener("keydown", handleReset);
  }, [gameState.isGameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4 px-4 font-mono text-xs uppercase tracking-widest text-neon-cyan">
        <div className="flex flex-col">
          <span>Score</span>
          <span className="text-xl text-neon-magenta">{gameState.score}</span>
        </div>
        <div className="flex flex-col text-right">
          <span>Best</span>
          <span className="text-xl">{gameState.highScore}</span>
        </div>
      </div>
      
      <div className="relative group p-1 neon-border bg-black">
        <div className="crt-screen">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="block max-w-full h-auto cursor-none"
          />
        </div>
        
        {/* Decorative corner brackets */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-neon-magenta group-hover:scale-125 transition-transform"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-neon-magenta group-hover:scale-125 transition-transform"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-neon-magenta group-hover:scale-125 transition-transform"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-neon-magenta group-hover:scale-125 transition-transform"></div>
      </div>

      <div className="mt-6 flex gap-8 text-[10px] uppercase font-mono text-neon-cyan/50 italic">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-neon-cyan animate-pulse"></span>
          ARROWS TO NAVIGATE
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-neon-magenta animate-pulse"></span>
          EAT DATA TO GROW
        </div>
      </div>
    </div>
  );
}
