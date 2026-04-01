'use client';

import { useState } from 'react';
import { Search, Zap, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function HeroSection({ onAnalyze, isLoading }: HeroSectionProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent))_0%,transparent_50%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/20 mb-8 animate-fade-in">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-accent-foreground">Analiză SEO Profesională</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up">
          <span className="gradient-text">Audit SEO</span>
          <br />
          <span className="text-foreground">& Analiză Semantică</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Obține un raport complet despre performanța site-ului tău.
          Analizăm viteza, cuvintele cheie și optimizarea SEO în câteva secunde.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-col sm:flex-row gap-3 p-2 bg-card rounded-2xl shadow-xl border border-border/50">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="Introdu URL-ul site-ului (ex: https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-12 h-14 border-0 shadow-none focus-visible:ring-0 bg-transparent"
                required
              />
            </div>
            <Button
              type="submit"
              variant="hero"
              size="xl"
              disabled={isLoading || !url.trim()}
              className="sm:w-auto w-full"
            >
              {isLoading ? 'Se analizează...' : 'Începe Auditul'}
            </Button>
          </div>
        </form>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {[
            { icon: Zap, text: 'Analiză rapidă' },
            { icon: Shield, text: 'Date securizate' },
            { icon: BarChart3, text: 'Raport detaliat' },
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-muted-foreground">
              <feature.icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
