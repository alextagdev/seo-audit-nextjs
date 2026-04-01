'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ceva nu a mers bine!</h2>
        <p className="text-muted-foreground mb-8">
          Ne pare rău, a apărut o eroare neașteptată.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Încearcă din nou
        </button>
      </div>
    </div>
  );
}
