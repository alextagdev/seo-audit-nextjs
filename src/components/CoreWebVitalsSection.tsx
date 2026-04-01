import { Activity, Info } from 'lucide-react';
import { WebVitalGauge } from './WebVitalGauge';

interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint (seconds)
  fid: number; // First Input Delay (milliseconds)
  cls: number; // Cumulative Layout Shift (score)
  fcp: number; // First Contentful Paint (seconds)
  ttfb: number; // Time to First Byte (milliseconds)
}

interface CoreWebVitalsSectionProps {
  vitals: CoreWebVitals;
}

export function CoreWebVitalsSection({ vitals }: CoreWebVitalsSectionProps) {
  // Calculate overall score
  const getOverallScore = () => {
    let score = 0;
    
    // LCP scoring
    if (vitals.lcp <= 2.5) score += 33;
    else if (vitals.lcp <= 4) score += 16;
    
    // FID scoring
    if (vitals.fid <= 100) score += 33;
    else if (vitals.fid <= 300) score += 16;
    
    // CLS scoring
    if (vitals.cls <= 0.1) score += 34;
    else if (vitals.cls <= 0.25) score += 17;
    
    return Math.round(score);
  };

  const overallScore = getOverallScore();
  const overallStatus = overallScore >= 90 ? 'Excelent' : overallScore >= 50 ? 'Necesită îmbunătățiri' : 'Slab';
  const overallColor = overallScore >= 90 ? 'text-success' : overallScore >= 50 ? 'text-warning' : 'text-destructive';

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Core Web Vitals</h3>
            <p className="text-sm text-muted-foreground">Metrice Google pentru experiența utilizatorului</p>
          </div>
        </div>
        
        {/* Overall Score */}
        <div className="text-right">
          <div className={`text-3xl font-bold ${overallColor}`}>{overallScore}%</div>
          <div className="text-sm text-muted-foreground">{overallStatus}</div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50 border border-primary/10 mb-6">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Core Web Vitals sunt metrici esențiale pentru SEO. Google le folosește ca factori de ranking.
          Valorile afișate sunt estimate pe baza structurii paginii.
        </p>
      </div>

      {/* Vitals Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <WebVitalGauge
          label="LCP"
          value={vitals.lcp}
          unit="s"
          thresholds={{ good: 2.5, needsImprovement: 4 }}
          description="Largest Contentful Paint - Timpul până la afișarea conținutului principal"
        />
        <WebVitalGauge
          label="FID"
          value={vitals.fid}
          unit="ms"
          thresholds={{ good: 100, needsImprovement: 300 }}
          description="First Input Delay - Timpul de răspuns la prima interacțiune"
        />
        <WebVitalGauge
          label="CLS"
          value={vitals.cls}
          unit=""
          thresholds={{ good: 0.1, needsImprovement: 0.25 }}
          description="Cumulative Layout Shift - Stabilitatea vizuală a paginii"
          inverse
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
          <div>
            <p className="text-sm font-medium text-foreground">First Contentful Paint (FCP)</p>
            <p className="text-xs text-muted-foreground">Prima randare de conținut</p>
          </div>
          <div className="text-right">
            <span className={`text-lg font-bold ${vitals.fcp <= 1.8 ? 'text-success' : vitals.fcp <= 3 ? 'text-warning' : 'text-destructive'}`}>
              {vitals.fcp.toFixed(1)}s
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
          <div>
            <p className="text-sm font-medium text-foreground">Time to First Byte (TTFB)</p>
            <p className="text-xs text-muted-foreground">Răspunsul serverului</p>
          </div>
          <div className="text-right">
            <span className={`text-lg font-bold ${vitals.ttfb <= 200 ? 'text-success' : vitals.ttfb <= 500 ? 'text-warning' : 'text-destructive'}`}>
              {vitals.ttfb}ms
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Bun</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-sm text-muted-foreground">De îmbunătățit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-sm text-muted-foreground">Slab</span>
        </div>
      </div>
    </div>
  );
}
