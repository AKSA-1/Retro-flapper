import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

type GameOverProps = {
  score: number;
  highScore: number;
  onRestart: () => void;
};

export function GameOver({ score, highScore, onRestart }: GameOverProps) {
  return (
    <div
      className="absolute inset-0 bg-background/80 flex items-center justify-center z-20 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="game-over-title"
    >
      <Card className="w-[350px] text-center border-4 border-destructive">
        <CardHeader>
          <CardTitle id="game-over-title" className="text-5xl font-bold text-destructive">Game Over</CardTitle>
          <CardDescription>Better luck next time, flapper!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-bold">Score: <span className="text-primary">{score}</span></p>
            <p className="text-xl font-medium">High Score: <span className="text-accent-foreground">{highScore}</span></p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onRestart} size="lg" variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg">
            Restart Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
