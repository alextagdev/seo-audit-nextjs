'use client';

import { Gauge, FileText, AlertTriangle, Zap, Globe } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { KeywordsSection } from './KeywordsSection';
import { AuditSection } from './AuditSection';
import { BlurredSection } from './BlurredSection';
import { CoreWebVitalsSection } from './CoreWebVitalsSection';
import { SocialPreviewSection } from './SocialPreviewSection';
import { GEOSection } from './GEOSection';
import { SchemaSection } from './SchemaSection';
import { SEOAdvancedSection } from './SEOAdvancedSection';
import { CategoryScoresSection } from './CategoryScoresSection';
import { SecuritySection } from './SecuritySection';
import { AccessibilitySection } from './AccessibilitySection';
import { PlatformSection } from './PlatformSection';
import { AICrawlersSection } from './AICrawlersSection';
import { ResourcesSection } from './ResourcesSection';
import { AuditResult } from '@/lib/api';

interface DashboardProps {
  data: AuditResult;
  onUnlock: (email: string) => void;
  isSubmitting: boolean;
}

export function Dashboard({ data, onUnlock, isSubmitting }: DashboardProps) {
  const getScoreVariant = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const getSpeedVariant = (rating: string) => {
    if (rating === 'fast') return 'success';
    if (rating === 'medium') return 'warning';
    return 'error';
  };

  const speedItems = [
    {
      label: 'Time to First Byte (TTFB)',
      value: `${data.speed.ttfb}ms`,
      status: data.speed.ttfb < 200 ? 'ok' as const : data.speed.ttfb < 500 ? 'warning' as const : 'fix' as const,
      description: data.speed.ttfb < 200 ? 'Excelent! Server rapid.' : 'Server-ul răspunde lent.',
    },
    {
      label: 'Imagini WebP',
      value: data.seo.hasWebP ? 'Da' : 'Nu',
      status: data.seo.hasWebP ? 'ok' as const : 'fix' as const,
      description: data.seo.hasWebP ? 'Format modern de imagini.' : 'Recomandăm conversia la WebP.',
    },
    {
      label: 'Timp Total de Încărcare',
      value: `${data.speed.loadTime}s`,
      status: data.speed.loadTime < 2 ? 'ok' as const : data.speed.loadTime < 4 ? 'warning' as const : 'fix' as const,
    },
  ];

  const seoItems = [
    {
      label: 'Titlu SEO',
      value: `${data.seo.titleLength} caractere`,
      status: data.seo.titleLength >= 30 && data.seo.titleLength <= 60 ? 'ok' as const : 'warning' as const,
      description: data.content.title || 'Fără titlu',
    },
    {
      label: 'Meta Description',
      value: `${data.seo.descriptionLength} caractere`,
      status: data.seo.descriptionLength >= 120 && data.seo.descriptionLength <= 160 ? 'ok' as const : 'warning' as const,
    },
    {
      label: 'Tag H1',
      value: `${data.content.h1Count} găsite`,
      status: data.content.h1Count === 1 ? 'ok' as const : 'fix' as const,
      description: data.content.h1Count === 1 ? 'Perfect! Un singur H1.' : 'Ar trebui să existe exact un H1.',
    },
    {
      label: 'Viewport Meta',
      status: data.seo.hasViewport ? 'ok' as const : 'fix' as const,
    },
    {
      label: 'Canonical URL',
      status: data.seo.hasCanonical ? 'ok' as const : 'fix' as const,
    },
    {
      label: 'Schema.org Markup',
      status: data.seo.hasSchema ? 'ok' as const : 'fix' as const,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Raport SEO pentru <span className="gradient-text">{data.url}</span>
        </h2>
        <p className="text-muted-foreground">Analiză completă a performanței și optimizării</p>
        {data.platform && data.platform.cms && (
          <p className="text-sm text-muted-foreground mt-2">
            Platform: <span className="font-medium text-primary">{data.platform.cms}</span>
            {data.platform.theme && <span> • Theme: {data.platform.theme}</span>}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Scor Global"
          value={data.score}
          subtitle="din 100"
          icon={Gauge}
          variant={getScoreVariant(data.score)}
        />
        <StatsCard
          title="Viteză"
          value={`${data.speed.loadTime}s`}
          subtitle={data.speed.rating === 'fast' ? 'Rapid' : data.speed.rating === 'medium' ? 'Mediu' : 'Lent'}
          icon={Zap}
          variant={getSpeedVariant(data.speed.rating)}
        />
        <StatsCard
          title="Cuvinte"
          value={data.content.wordCount}
          subtitle="în conținut"
          icon={FileText}
          variant="default"
        />
        <StatsCard
          title="Erori SEO"
          value={data.errors.length}
          subtitle="de corectat"
          icon={AlertTriangle}
          variant={data.errors.length === 0 ? 'success' : 'error'}
        />
      </div>

      {/* Category Scores */}
      {data.categoryScores && (
        <div className="mb-8">
          <CategoryScoresSection categoryScores={data.categoryScores} />
        </div>
      )}

      {/* Core Web Vitals */}
      <div className="mb-8">
        <CoreWebVitalsSection vitals={data.webVitals} />
      </div>

      {/* Social Media Preview */}
      <div className="mb-8">
        <SocialPreviewSection 
          social={data.social}
          url={data.url}
          fallbackTitle={data.content.title}
          fallbackDescription={data.content.description}
        />
      </div>

      {/* Keywords */}
      <div className="mb-8">
        <KeywordsSection keywords={data.content.keywords} />
      </div>

      {/* GEO and Schema Sections */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <GEOSection geo={data.geo} />
        <SchemaSection schema={data.schema} />
      </div>

      {/* Security and Accessibility */}
      {(data.security || data.accessibility) && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {data.security && <SecuritySection security={data.security} />}
          {data.accessibility && <AccessibilitySection accessibility={data.accessibility} />}
        </div>
      )}

      {/* Platform and AI Crawlers */}
      {(data.platform || data.aiCrawlers) && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {data.platform && <PlatformSection platform={data.platform} />}
          {data.aiCrawlers && <AICrawlersSection aiCrawlers={data.aiCrawlers} />}
        </div>
      )}

      {/* SEO Advanced and Resources */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <SEOAdvancedSection seoAdvanced={data.seoAdvanced} />
        {data.resources && <ResourcesSection resources={data.resources} />}
      </div>

      {/* Free Sections */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <AuditSection
          title="Viteză & Performanță"
          icon={Zap}
          items={speedItems}
        />
        <AuditSection
          title="SEO On-Page"
          icon={Globe}
          items={seoItems}
        />
      </div>

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            💡 Recomandări de Îmbunătățire
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
            Acționează pe acestea pentru a-ți îmbunătăți scorul SEO și GEO
          </p>
          <ul className="space-y-2">
            {data.recommendations.slice(0, 8).map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-blue-900 dark:text-blue-100">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">→</span>
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Premium Blurred Section */}
      <BlurredSection onUnlock={onUnlock} isSubmitting={isSubmitting} />
    </div>
  );
}
