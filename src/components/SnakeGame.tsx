import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isGameOver) return;
    
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ') {
      setIsPaused(p => !p);
      return;
    }

    const currentDir = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
        break;
    }
  }, [isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const newHead = {
        x: prevSnake[0].x + directionRef.current.x,
        y: prevSnake[0].y + directionRef.current.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      setDirection(directionRef.current);
      return newSnake;
    });
  }, [food, isGameOver, isPaused, highScore, generateFood]);

  useEffect(() => {
    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    gameLoopRef.current = window.setInterval(moveSnake, speed);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, score]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-[400px] mb-6 gap-4 relative z-10">
        <div className="flex flex-col items-start justify-center border-l-4 border-[#0ff] px-4 py-2 bg-black w-32 shadow-[4px_4px_0px_#0ff]">
          <span className="text-[#f0f] text-sm uppercase tracking-widest mb-1">SCORE_VAL</span>
          <span className="text-[#0ff] font-bold text-2xl">{score}</span>
        </div>
        <div className="flex flex-col items-end justify-center border-r-4 border-[#f0f] px-4 py-2 bg-black w-32 shadow-[-4px_4px_0px_#f0f]">
          <span className="text-[#0ff] text-sm uppercase tracking-widest mb-1">MAX_VAL</span>
          <span className="text-[#f0f] font-bold text-2xl">{highScore}</span>
        </div>
      </div>

      <div className="relative bg-black border-4 border-[#0ff] p-2 shadow-[8px_8px_0px_#f0f] hover:shadow-[12px_12px_0px_#f0f] transition-shadow">
        <div className="absolute -top-3 -right-3 bg-[#f0f] text-black text-xs px-2 py-1 font-bold z-20">
          EXEC_SNAKE.EXE
        </div>
        <div 
          className="grid bg-[#111] border-2 border-[#f0f]"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: '400px',
            height: '400px'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full border border-[#0ff]/10 ${
                  isSnakeHead ? 'bg-[#0ff] shadow-[0_0_10px_#0ff] z-10' :
                  isSnakeBody ? 'bg-[#0ff]/70' :
                  isFood ? 'bg-[#f0f] shadow-[0_0_15px_#f0f] animate-pulse' :
                  ''
                }`}
              />
            );
          })}
        </div>

        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-[#f0f] m-2">
            <h2 className="text-5xl font-black text-[#f0f] mb-4 tracking-[0.2em] uppercase glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
            <p className="text-[#0ff] mb-8 text-xl">&gt; FINAL_SCORE: {score}</p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-black text-[#0ff] border-4 border-[#0ff] hover:bg-[#0ff] hover:text-black transition-all uppercase tracking-widest font-bold text-lg shadow-[4px_4px_0px_#f0f]"
            >
              REBOOT_SYS
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-4 border-[#0ff] m-2">
            <h2 className="text-5xl font-black text-[#0ff] mb-6 tracking-widest uppercase glitch-text" data-text="SYS_PAUSED">SYS_PAUSED</h2>
            <button 
              onClick={() => setIsPaused(false)}
              className="px-8 py-3 bg-black text-[#f0f] border-4 border-[#f0f] hover:bg-[#f0f] hover:text-black transition-all uppercase tracking-widest font-bold text-lg shadow-[4px_4px_0px_#0ff]"
            >
              RESUME_EXEC
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-[#0ff] text-lg flex gap-6 relative z-10 bg-black p-2 border-2 border-[#f0f]">
        <span className="flex items-center gap-2">
          &gt; INPUT: <kbd className="bg-[#f0f] px-2 text-black font-bold">W A S D</kbd> / <kbd className="bg-[#f0f] px-2 text-black font-bold">ARROWS</kbd>
        </span>
        <span className="flex items-center gap-2">
          &gt; HALT: <kbd className="bg-[#0ff] px-2 text-black font-bold">SPACE</kbd>
        </span>
      </div>
    </div>
  );
}
