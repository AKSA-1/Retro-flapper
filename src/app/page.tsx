import Game from '@/components/game/Game';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6">
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-4xl sm:text-6xl font-bold text-primary tracking-wider">
          Retro Flapper
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Tap to flap, avoid the pipes!</p>
      </div>
      <Game />
    </main>
  );
}
