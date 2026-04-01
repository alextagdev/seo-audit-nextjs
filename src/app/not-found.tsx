import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Pagina nu a fost găsită</h1>
        <p className="text-muted-foreground mb-8">
          Ne pare rău, pagina pe care o cauți nu există.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Înapoi la Pagina Principală
        </Link>
      </div>
    </div>
  );
}
