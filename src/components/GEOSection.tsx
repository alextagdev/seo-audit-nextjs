'use client';

import { Brain, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { GEOAnalysis } from '@/lib/types/audit';

interface GEOSectionProps {
  geo: GEOAnalysis;
}

export function GEOSection({ geo }: GEOSectionProps) {
  const features = [
    { label: 'Conținut FAQ', value: geo.hasFAQContent },
    { label: 'Format Q&A', value: geo.hasQuestionAnswerFormat },
    { label: 'Ghid pas cu pas', value: geo.hasStepByStepContent },
    { label: 'Liste structurate', value: geo.hasListContent },
    { label: 'Secțiune rezumat', value: geo.hasSummarySection },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Excelent';
    if (score >= 40) return 'Bun';
    return 'Necesită îmbunătățire';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <div>
            <CardTitle>GEO - Generative Engine Optimization</CardTitle>
            <CardDescription>
              Optimizare pentru AI engines (ChatGPT, Claude, Perplexity)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Structured Data Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Scor Structured Data</span>
            <span className={`text-lg font-bold ${getScoreColor(geo.structuredDataScore)}`}>
              {geo.structuredDataScore}/100
            </span>
          </div>
          <Progress value={geo.structuredDataScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {getScoreLabel(geo.structuredDataScore)}
          </p>
        </div>

        {/* Readability Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Scor Lizibilitate</span>
            <span className={`text-lg font-bold ${getScoreColor(geo.readabilityScore)}`}>
              {geo.readabilityScore}/100
            </span>
          </div>
          <Progress value={geo.readabilityScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {getScoreLabel(geo.readabilityScore)}
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Caracteristici GEO detectate</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
              >
                {feature.value ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span className="text-sm">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Length */}
        <div className="p-4 bg-accent/50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Lungime conținut</span>
            <span className="text-sm font-semibold text-primary capitalize">
              {geo.contentLength === 'short' && 'Scurt'}
              {geo.contentLength === 'medium' && 'Mediu'}
              {geo.contentLength === 'long' && 'Lung'}
            </span>
          </div>
        </div>

        {/* Recommendations */}
        {geo.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Recomandări GEO</h4>
            <ul className="space-y-2">
              {geo.recommendations.slice(0, 3).map((rec, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
