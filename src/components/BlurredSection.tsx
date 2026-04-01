'use client';

import { Lock, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuditSection } from './AuditSection';
import { Settings, Globe, Database } from 'lucide-react';

interface BlurredSectionProps {
  onUnlock: (email: string) => void;
  isSubmitting: boolean;
}

// Mock premium data
const premiumData = {
  technical: {
    title: 'Tehnic Avansat',
    icon: Settings,
    items: [
      { label: 'HTTPS Activ', status: 'ok' as const },
      { label: 'Robots.txt', status: 'ok' as const },
      { label: 'Sitemap XML', status: 'fix' as const },
      { label: 'Compresie Gzip', status: 'ok' as const },
      { label: 'Cache Headers', status: 'warning' as const },
    ],
  },
  schema: {
    title: 'Schema.org & Date Structurate',
    icon: Database,
    items: [
      { label: 'Organization Schema', status: 'fix' as const },
      { label: 'Breadcrumbs', status: 'fix' as const },
      { label: 'FAQ Schema', status: 'fix' as const },
      { label: 'Article Schema', status: 'ok' as const },
    ],
  },
  local: {
    title: 'SEO Local',
    icon: Globe,
    items: [
      { label: 'Google Business Profile', status: 'warning' as const },
      { label: 'NAP Consistency', status: 'ok' as const },
      { label: 'Local Keywords', status: 'fix' as const },
    ],
  },
};

export function BlurredSection({ onUnlock, isSubmitting }: BlurredSectionProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onUnlock(email.trim());
    }
  };

  return (
    <div className="relative mt-8">
      {/* Blurred Content */}
      <div className="blur-premium select-none pointer-events-none">
        <div className="grid md:grid-cols-2 gap-6">
          <AuditSection {...premiumData.technical} />
          <AuditSection {...premiumData.schema} />
        </div>
        <div className="mt-6">
          <AuditSection {...premiumData.local} />
        </div>
      </div>

      {/* Unlock Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-background/60 via-background/80 to-background/95 backdrop-blur-[2px]">
        <div className="max-w-md w-full mx-4 bg-card rounded-2xl p-8 shadow-xl border border-border/50 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Deblochează Raportul Complet
          </h3>
          <p className="text-muted-foreground mb-6">
            Primește analiza completă direct în inbox-ul tău, inclusiv recomandări tehnice avansate.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="adresa@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12"
                required
              />
            </div>
            <Button
              type="submit"
              variant="premium"
              size="lg"
              className="w-full"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting ? (
                'Se trimite...'
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Trimite Raportul
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            Nu trimitem spam. Datele tale sunt în siguranță.
          </p>
        </div>
      </div>
    </div>
  );
}
