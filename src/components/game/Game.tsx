"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bird } from '@/components/game/Bird';
import { Pipe } from '@/components/game/Pipe';
import { GameOver } from '@/components/game/GameOver';
import { Background } from '@/components/game/Background';
import { Button } from '@/components/ui/button';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 30;
const BIRD_LEFT_POSITION = 100;
const GRAVITY = 0.6;
const FLAP_STRENGTH = 10;
const PIPE_WIDTH = 80;
const INITIAL_PIPE_SPEED = 2.5;
const SPEED_INCREASE_INTERVAL = 30000; // 30 seconds in ms
const PIPE_SPACING = 350;

type PipeState = {
  x: number;
  gapY: number;
  gapSize: number;
  scored: boolean;
};

const generateObstacleParameters = (score: number) => {
    const baseGapSize = 180;
    const minGapSize = 100;
    const difficultyFactor = Math.min(score / 50, 1);
    const gapSize = baseGapSize - (baseGapSize - minGapSize) * difficultyFactor;
    
    const randomGapAdjustment = (Math.random() - 0.5) * 20;
    const finalGapSize = Math.max(minGapSize, gapSize + randomGapAdjustment);

    const gapMargin = 80;
    const randomY = Math.random();
    const gapY = gapMargin + finalGapSize / 2 + (GAME_HEIGHT - (gapMargin * 2) - finalGapSize) * randomY;

    if (score > 10 && Math.random() < 0.2) {
      const waveCenter = GAME_HEIGHT / 2;
      const waveAmplitude = 100;
      const wavePosition = Math.sin(score * 0.5);
      const waveGapY = waveCenter + waveAmplitude * wavePosition;
      return {
        gapY: waveGapY,
        gapSize: finalGapSize - 10,
      };
    }

    return {
      gapY: gapY,
      gapSize: finalGapSize,
    };
};

export default function Game() {
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<PipeState[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [pipeSpeed, setPipeSpeed] = useState(INITIAL_PIPE_SPEED);

  const gameLoopRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width } = entry.contentRect;
            setScale(width / GAME_WIDTH);
        }
    });

    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
        const { width } = containerRef.current.getBoundingClientRect();
        setScale(width / GAME_WIDTH);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const playedBefore = localStorage.getItem('retroFlapperPlayedBefore');
    if (!playedBefore) {
      setShowInstructions(true);
    }
    const savedHighScore = localStorage.getItem('retroFlapperHighScore');
    if (savedHighScore) {
      setHighScore(Number(savedHighScore));
    }
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) {
      return;
    }
    const speedInterval = setInterval(() => {
      setPipeSpeed((prevSpeed) => prevSpeed * 1.15);
    }, SPEED_INCREASE_INTERVAL);

    return () => clearInterval(speedInterval);
  }, [gameStarted, gameOver]);

  const handleGameOver = useCallback(() => {
    if (gameOver) return;
    if (score > highScore) {
      const newHighScore = score;
      setHighScore(newHighScore);
      localStorage.setItem('retroFlapperHighScore', newHighScore.toString());
    }
    setGameOver(true);
  }, [score, highScore, gameOver]);


  const resetGame = () => {
    setBirdPosition(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameStarted(false);
    setGameOver(false);
    setPipeSpeed(INITIAL_PIPE_SPEED);
  };

  const flap = useCallback(() => {
    if (gameOver) return;
    if (showInstructions) {
      setShowInstructions(false);
      localStorage.setItem('retroFlapperPlayedBefore', 'true');
    }
    if (!gameStarted) {
      setGameStarted(true);
    }
    setBirdVelocity(-FLAP_STRENGTH);
  }, [gameOver, gameStarted, showInstructions]);

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    flap();
  }, [flap]);

  const gameLoop = useCallback(() => {
    if (!gameStarted || gameOver) {
      return;
    }
    
    const currentPipeSpeed = pipeSpeed;

    // Bird physics
    const newVelocity = birdVelocity + GRAVITY;
    const newPosition = birdPosition + newVelocity;
    setBirdVelocity(newVelocity);
    setBirdPosition(newPosition);

    // Pipe logic: movement, scoring, and spawning
    let scoreNeedsUpdate = false;
    let newPipes = pipes
      .map(pipe => {
        const movedPipe = { ...pipe, x: pipe.x - currentPipeSpeed };
        if (!movedPipe.scored && movedPipe.x + PIPE_WIDTH < BIRD_LEFT_POSITION) {
          scoreNeedsUpdate = true;
          return { ...movedPipe, scored: true };
        }
        return movedPipe;
      })
      .filter(pipe => pipe.x > -PIPE_WIDTH);
    
    if (scoreNeedsUpdate) {
      setScore(s => s + 1);
    }
    
    const lastPipe = newPipes[newPipes.length - 1];
    if (!lastPipe || GAME_WIDTH - lastPipe.x >= PIPE_SPACING) {
      const params = generateObstacleParameters(score);
      newPipes.push({
        x: GAME_WIDTH,
        gapY: params.gapY,
        gapSize: params.gapSize,
        scored: false,
      });
    }
    setPipes(newPipes);

    // Collision detection
    // Ground and ceiling collision
    if (newPosition >= GAME_HEIGHT - BIRD_SIZE || newPosition <= 0) {
      handleGameOver();
      return;
    }

    // Pipe collision
    for (const pipe of newPipes) {
      const birdRight = BIRD_LEFT_POSITION + BIRD_SIZE;
      const pipeRight = pipe.x + PIPE_WIDTH;

      if (birdRight > pipe.x && BIRD_LEFT_POSITION < pipeRight) {
        const topPipeBottom = pipe.gapY - pipe.gapSize / 2;
        const bottomPipeTop = pipe.gapY + pipe.gapSize / 2;
        if (newPosition < topPipeBottom || newPosition + BIRD_SIZE > bottomPipeTop) {
          handleGameOver();
          return;
        }
      }
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, gameOver, birdVelocity, pipes, score, birdPosition, handleGameOver, pipeSpeed]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, gameLoop]);
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [flap]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[800px]"
      style={{ height: GAME_HEIGHT * scale }}
      role="application"
      aria-label="Retro Flapper game canvas"
    >
      <div
        className="relative bg-background border-4 border-primary-foreground rounded-lg shadow-2xl"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          overflow: 'hidden',
          cursor: 'pointer',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          touchAction: 'none'
        }}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <Background />
        
        {showInstructions && (
          <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-30 p-8 text-center backdrop-blur-sm">
              <h2 className="text-4xl font-bold text-foreground mb-4">How to Play</h2>
              <p className="text-xl text-muted-foreground mb-6">
                  Tap anywhere on the screen (or press Spacebar) to make the bird flap.
              </p>
              <p className="text-xl text-muted-foreground mb-8">
                  Guide the bird through the gaps in the pipes to score points.
              </p>
              <Button onClick={flap} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg">
                  Start Flapping!
              </Button>
          </div>
        )}

        {!gameStarted && !gameOver && !showInstructions && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <p className="text-3xl font-bold text-foreground animate-pulse">Click or Press Space to Start</p>
          </div>
        )}

        <div className="absolute top-4 left-4 text-4xl font-bold text-white z-10" style={{textShadow: '2px 2px 4px #000'}}>
          SCORE: {score}
        </div>
        <div className="absolute top-4 right-4 text-2xl font-bold text-white z-10" style={{textShadow: '2px 2px 4px #000'}}>
          HIGH: {highScore}
        </div>
        
        <Bird birdPosition={birdPosition} birdSize={BIRD_SIZE} />
        
        {pipes.map((pipe, index) => (
          <Pipe
            key={index}
            pipeX={pipe.x}
            pipeWidth={PIPE_WIDTH}
            gapY={pipe.gapY}
            gapSize={pipe.gapSize}
            gameHeight={GAME_HEIGHT}
          />
        ))}
        
        {gameOver && <GameOver score={score} highScore={highScore} onRestart={resetGame} />}
      </div>
    </div>
  );
}
