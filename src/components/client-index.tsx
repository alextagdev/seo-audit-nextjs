'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { LoadingProgress } from '@/components/LoadingProgress';
import { Dashboard } from '@/components/Dashboard';
import { useToast } from '@/hooks/use-toast';
import { analyzeUrl, sendReport, AuditResult } from '@/lib/api';

type AppState = 'idle' | 'loading' | 'results';

export function ClientIndex() {
  const [state, setState] = useState<AppState>('idle');
  const [auditData, setAuditData] = useState<AuditResult | null>(null);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async (url: string) => {
    setState('loading');

    try {
      const [result] = await Promise.all([
        analyzeUrl(url),
        new Promise(resolve => setTimeout(resolve, 4000)),
      ]);

      setAuditData(result);
      setState('results');

      toast({
        title: 'Analiză completă!',
        description: 'Raportul SEO a fost generat cu succes.',
      });
    } catch (error) {
      console.error('Analysis error:', error);

      // Mock data for demo mode
      const mockData: AuditResult = {
        url: url,
        score: 68,
        categoryScores: {
          overall: 68,
          aiVisibility: { score: 4, max: 6 },
          onPageSeo: { score: 18, max: 25 },
          technical: { score: 14, max: 20 },
          security: { score: 8, max: 15 },
          performance: { score: 12, max: 20 },
          accessibility: { score: 10, max: 14 },
        },
        speed: {
          ttfb: 245,
          loadTime: 2.8,
          rating: 'medium',
        },
        webVitals: {
          lcp: 2.1,
          fid: 85,
          cls: 0.08,
          fcp: 1.4,
          ttfb: 245,
        },
        social: {
          ogTitle: 'Exemplu de Titlu pentru Social Media',
          ogDescription: 'Aceasta este o descriere optimizată pentru partajare pe rețelele sociale.',
          ogImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
          ogType: 'website',
          ogUrl: url,
          twitterCard: 'summary_large_image',
          twitterTitle: null,
          twitterDescription: null,
          twitterImage: null,
          twitterSite: null,
        },
        content: {
          title: 'Exemplu de Titlu SEO',
          description: 'Aceasta este o descriere meta exemplu pentru demonstrație.',
          wordCount: 1250,
          h1Count: 1,
          keywords: ['SEO', 'optimizare', 'marketing', 'digital', 'website', 'performanță', 'analiză'],
        },
        seo: {
          hasViewport: true,
          hasCanonical: false,
          hasSchema: false,
          hasWebP: true,
          titleLength: 45,
          descriptionLength: 142,
        },
        seoAdvanced: {
          images: {
            total: 15,
            withAlt: 12,
            withoutAlt: 3,
            altCoverage: 80,
          },
          links: {
            internal: 24,
            external: 8,
            broken: 0,
          },
          headingStructure: {
            h1: 1,
            h2: 5,
            h3: 8,
            h4: 3,
            h5: 0,
            h6: 0,
            isHierarchyCorrect: true,
          },
          mobileFriendly: {
            hasViewport: true,
            hasResponsiveMeta: true,
            hasTouchIcons: false,
          },
        },
        schema: {
          hasJsonLd: false,
          schemaTypes: [],
          hasOrganization: false,
          hasBreadcrumb: false,
          hasArticle: false,
          hasFAQ: false,
          hasHowTo: false,
          hasLocalBusiness: false,
          errors: [],
          recommendations: [
            'Adaugă Schema.org markup în format JSON-LD',
            'Adaugă Organization schema pentru a identifica business-ul',
          ],
        },
        geo: {
          structuredDataScore: 45,
          readabilityScore: 72,
          hasFAQContent: false,
          hasQuestionAnswerFormat: false,
          hasStepByStepContent: true,
          hasListContent: true,
          hasSummarySection: false,
          contentLength: 'long',
          recommendations: [
            'Adaugă o secțiune de întrebări frecvente (FAQ)',
            'Structurează conținutul în format întrebare-răspuns',
            'Adaugă o secțiune de rezumat/concluzie',
          ],
        },
        security: {
          score: 8,
          maxScore: 15,
          https: true,
          hsts: false,
          hstsMaxAge: null,
          mixedContent: [],
          securityHeaders: {
            contentSecurityPolicy: false,
            xFrameOptions: true,
            xContentTypeOptions: true,
            strictTransportSecurity: false,
            xXssProtection: true,
            referrerPolicy: false,
            permissionsPolicy: false,
          },
          sslInfo: {
            valid: true,
            daysUntilExpiry: null,
          },
        },
        accessibility: {
          score: 10,
          maxScore: 14,
          issues: [
            {
              type: 'serious',
              message: '3 images missing alt attributes',
              count: 3,
            },
            {
              type: 'moderate',
              message: 'Heading elements are not in sequentially-descending order',
              count: 1,
            },
          ],
          checks: {
            hasAriaLabels: true,
            hasLangAttribute: true,
            imagesHaveAlt: false,
            linksHaveText: true,
            buttonsHaveAccessibleNames: true,
          },
        },
        platform: {
          cms: 'WordPress',
          theme: 'Custom Theme',
          frameworks: ['React'],
          server: 'nginx',
          cdn: 'Cloudflare',
        },
        aiCrawlers: {
          robotsTxtExists: true,
          llmsTxtExists: false,
          crawlers: [
            { name: 'GPTBot', userAgent: 'GPTBot', allowed: true, blocked: false },
            { name: 'ChatGPT-User', userAgent: 'ChatGPT-User', allowed: true, blocked: false },
            { name: 'Google-Extended', userAgent: 'Google-Extended', allowed: true, blocked: false },
            { name: 'PerplexityBot', userAgent: 'PerplexityBot', allowed: true, blocked: false },
            { name: 'ClaudeBot', userAgent: 'ClaudeBot', allowed: true, blocked: false },
            { name: 'Claude-Web', userAgent: 'Claude-Web', allowed: true, blocked: false },
            { name: 'anthropic-ai', userAgent: 'anthropic-ai', allowed: true, blocked: false },
            { name: 'Bytespider', userAgent: 'Bytespider', allowed: false, blocked: true },
            { name: 'CCBot', userAgent: 'CCBot', allowed: true, blocked: false },
            { name: 'FacebookBot', userAgent: 'FacebookBot', allowed: true, blocked: false },
            { name: 'Applebot-Extended', userAgent: 'Applebot-Extended', allowed: true, blocked: false },
            { name: 'cohere-ai', userAgent: 'cohere-ai', allowed: true, blocked: false },
          ],
        },
        resources: {
          totalRequests: 87,
          html: 1,
          css: 12,
          javascript: 28,
          images: 34,
          fonts: 5,
          other: 7,
          thirdParty: [
            'fonts.googleapis.com',
            'cdnjs.cloudflare.com',
            'www.google-analytics.com',
            'connect.facebook.net',
          ],
        },
        technical: {
          https: true,
          robotsTxt: true,
          sitemap: false,
          gzip: true,
          cacheHeaders: false,
        },
        errors: ['Lipsește tag-ul canonical', 'Nu există markup Schema.org', 'Lipsesc Twitter Cards complete'],
        recommendations: [
          'Adaugă Schema.org markup în format JSON-LD',
          'Implementează BreadcrumbList schema pentru o navigare mai clară',
          'Adaugă o secțiune de întrebări frecvente (FAQ)',
          'Structurează conținutul în format întrebare-răspuns pentru o mai bună înțelegere de către AI engines',
          'Adaugă atribute alt la 3 imagini pentru accessibility și SEO',
          'Adaugă touch icons (apple-touch-icon) pentru o experiență mobilă mai bună',
        ],
      };

      setAuditData(mockData);
      setState('results');

      toast({
        title: 'Mod Demo',
        description: 'Backend-ul nu este disponibil. Se afișează date demonstrative.',
        variant: 'default',
      });
    }
  };

  const handleUnlock = async (email: string) => {
    if (!auditData) return;

    setIsSubmittingEmail(true);

    try {
      await sendReport({ email, auditData });

      toast({
        title: 'Raport trimis!',
        description: `Verifică inbox-ul pentru ${email}`,
      });
    } catch (error) {
      console.error('Send report error:', error);

      toast({
        title: 'Email înregistrat (Demo)',
        description: `În modul demo, email-ul nu este trimis efectiv.`,
        variant: 'default',
      });
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleNewAudit = () => {
    setState('idle');
    setAuditData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg text-foreground">SEO Audit</span>
          </div>

          {state === 'results' && (
            <button
              onClick={handleNewAudit}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              + Audit Nou
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {state === 'idle' && (
          <HeroSection onAnalyze={handleAnalyze} isLoading={false} />
        )}

        {state === 'loading' && (
          <LoadingProgress />
        )}

        {state === 'results' && auditData && (
          <Dashboard
            data={auditData}
            onUnlock={handleUnlock}
            isSubmitting={isSubmittingEmail}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 SEO Audit Tool. Toate drepturile rezervate.
          </p>
        </div>
      </footer>
    </div>
  );
}
