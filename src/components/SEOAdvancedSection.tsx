'use client';

import { Image, Link2, Heading } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { SEOAdvanced } from '@/lib/types/audit';
import { StatusBadge } from './StatusBadge';

interface SEOAdvancedSectionProps {
  seoAdvanced: SEOAdvanced;
}

export function SEOAdvancedSection({ seoAdvanced }: SEOAdvancedSectionProps) {
  const getAltCoverageStatus = (coverage: number): 'ok' | 'warning' | 'fix' => {
    if (coverage >= 80) return 'ok';
    if (coverage >= 50) return 'warning';
    return 'fix';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Avansat</CardTitle>
        <CardDescription>
          Analiză detaliată a imaginilor, link-urilor și structurii
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Images Analysis */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Imagini</h4>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Acoperire Alt Text</span>
              <span className="text-sm font-bold text-primary">
                {seoAdvanced.images.withAlt}/{seoAdvanced.images.total} ({seoAdvanced.images.altCoverage}%)
              </span>
            </div>
            <Progress value={seoAdvanced.images.altCoverage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Total imagini</p>
              <p className="text-lg font-bold">{seoAdvanced.images.total}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Fără alt</p>
              <p className="text-lg font-bold text-destructive">{seoAdvanced.images.withoutAlt}</p>
            </div>
          </div>
        </div>

        {/* Links Analysis */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Link-uri</h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Interne</p>
              <p className="text-lg font-bold text-primary">{seoAdvanced.links.internal}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Externe</p>
              <p className="text-lg font-bold text-primary">{seoAdvanced.links.external}</p>
            </div>
          </div>
        </div>

        {/* Heading Structure */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Heading className="w-5 h-5 text-primary" />
            <h4 className="font-semibold">Structura Heading-urilor</h4>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <span className="text-sm">Ierarhie corectă</span>
            <StatusBadge status={seoAdvanced.headingStructure.isHierarchyCorrect ? 'ok' : 'fix'} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-muted/30 rounded text-center">
              <p className="text-xs text-muted-foreground">H1</p>
              <p className="font-bold">{seoAdvanced.headingStructure.h1}</p>
            </div>
            <div className="p-2 bg-muted/30 rounded text-center">
              <p className="text-xs text-muted-foreground">H2</p>
              <p className="font-bold">{seoAdvanced.headingStructure.h2}</p>
            </div>
            <div className="p-2 bg-muted/30 rounded text-center">
              <p className="text-xs text-muted-foreground">H3</p>
              <p className="font-bold">{seoAdvanced.headingStructure.h3}</p>
            </div>
          </div>
        </div>

        {/* Mobile Friendly */}
        <div className="space-y-3">
          <h4 className="font-semibold">Mobile-Friendly</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">Viewport Meta</span>
              <StatusBadge status={seoAdvanced.mobileFriendly.hasViewport ? 'ok' : 'fix'} />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">Responsive Meta</span>
              <StatusBadge status={seoAdvanced.mobileFriendly.hasResponsiveMeta ? 'ok' : 'fix'} />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm">Touch Icons</span>
              <StatusBadge status={seoAdvanced.mobileFriendly.hasTouchIcons ? 'ok' : 'warning'} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
