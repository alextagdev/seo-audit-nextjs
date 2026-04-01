import { Facebook, Twitter, Linkedin, Image, Check, X, ExternalLink } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface SocialMeta {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogType: string | null;
  ogUrl: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  twitterSite: string | null;
}

interface SocialPreviewSectionProps {
  social: SocialMeta;
  url: string;
  fallbackTitle: string;
  fallbackDescription: string;
}

export function SocialPreviewSection({ social, url, fallbackTitle, fallbackDescription }: SocialPreviewSectionProps) {
  const ogScore = [
    social.ogTitle,
    social.ogDescription,
    social.ogImage,
    social.ogType,
    social.ogUrl,
  ].filter(Boolean).length;

  const twitterScore = [
    social.twitterCard,
    social.twitterTitle,
    social.twitterDescription,
    social.twitterImage,
  ].filter(Boolean).length;

  const totalScore = Math.round(((ogScore / 5) * 50 + (twitterScore / 4) * 50));

  const displayTitle = social.ogTitle || social.twitterTitle || fallbackTitle || 'Fără titlu';
  const displayDescription = social.ogDescription || social.twitterDescription || fallbackDescription || 'Fără descriere';
  const displayImage = social.ogImage || social.twitterImage;
  const displayDomain = url ? new URL(url).hostname : 'example.com';

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-pink-500/20">
            <ExternalLink className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Social Media Preview</h3>
            <p className="text-sm text-muted-foreground">Open Graph & Twitter Cards</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${totalScore >= 80 ? 'text-success' : totalScore >= 50 ? 'text-warning' : 'text-destructive'}`}>
            {totalScore}%
          </div>
          <div className="text-xs text-muted-foreground">complet</div>
        </div>
      </div>

      {/* Preview Cards */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Facebook Preview */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Facebook className="w-4 h-4 text-[#1877F2]" />
            <span className="text-sm font-medium text-foreground">Facebook / LinkedIn</span>
          </div>
          <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
            {displayImage ? (
              <div className="aspect-[1.91/1] bg-muted relative overflow-hidden">
                <img 
                  src={displayImage} 
                  alt="OG Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Image className="w-12 h-12 text-muted-foreground/30" />
                </div>
              </div>
            ) : (
              <div className="aspect-[1.91/1] bg-muted flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground">Lipsește og:image</span>
                </div>
              </div>
            )}
            <div className="p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{displayDomain}</p>
              <h4 className="text-sm font-semibold text-foreground line-clamp-2 mb-1">{displayTitle}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{displayDescription}</p>
            </div>
          </div>
        </div>

        {/* Twitter Preview */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Twitter className="w-4 h-4 text-[#1DA1F2]" />
            <span className="text-sm font-medium text-foreground">Twitter / X</span>
          </div>
          <div className="border border-border rounded-2xl overflow-hidden bg-muted/30">
            {displayImage ? (
              <div className="aspect-[2/1] bg-muted relative overflow-hidden">
                <img 
                  src={displayImage} 
                  alt="Twitter Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Image className="w-12 h-12 text-muted-foreground/30" />
                </div>
              </div>
            ) : (
              <div className="aspect-[2/1] bg-muted flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                  <span className="text-xs text-muted-foreground">Lipsește twitter:image</span>
                </div>
              </div>
            )}
            <div className="p-3">
              <h4 className="text-sm font-semibold text-foreground line-clamp-1 mb-1">{displayTitle}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{displayDescription}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                {displayDomain}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meta Tags Checklist */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Open Graph */}
        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-[#1877F2]/10 flex items-center justify-center">
              <Facebook className="w-3 h-3 text-[#1877F2]" />
            </div>
            <span className="font-medium text-foreground text-sm">Open Graph</span>
            <span className="ml-auto text-xs text-muted-foreground">{ogScore}/5</span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'og:title', value: social.ogTitle },
              { label: 'og:description', value: social.ogDescription },
              { label: 'og:image', value: social.ogImage },
              { label: 'og:type', value: social.ogType },
              { label: 'og:url', value: social.ogUrl },
            ].map((tag) => (
              <div key={tag.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{tag.label}</span>
                {tag.value ? (
                  <span className="flex items-center gap-1 text-success">
                    <Check className="w-3 h-3" />
                    <span className="text-xs max-w-[120px] truncate">{tag.value}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-destructive">
                    <X className="w-3 h-3" />
                    <span className="text-xs">Lipsește</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Twitter Cards */}
        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-[#1DA1F2]/10 flex items-center justify-center">
              <Twitter className="w-3 h-3 text-[#1DA1F2]" />
            </div>
            <span className="font-medium text-foreground text-sm">Twitter Cards</span>
            <span className="ml-auto text-xs text-muted-foreground">{twitterScore}/4</span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'twitter:card', value: social.twitterCard },
              { label: 'twitter:title', value: social.twitterTitle },
              { label: 'twitter:description', value: social.twitterDescription },
              { label: 'twitter:image', value: social.twitterImage },
            ].map((tag) => (
              <div key={tag.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{tag.label}</span>
                {tag.value ? (
                  <span className="flex items-center gap-1 text-success">
                    <Check className="w-3 h-3" />
                    <span className="text-xs max-w-[120px] truncate">{tag.value}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-destructive">
                    <X className="w-3 h-3" />
                    <span className="text-xs">Lipsește</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {totalScore < 100 && (
        <div className="mt-4 p-4 rounded-lg bg-warning/10 border border-warning/20">
          <p className="text-sm text-warning font-medium mb-2">Recomandări:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {!social.ogImage && <li>• Adaugă o imagine og:image (recomandat: 1200x630px)</li>}
            {!social.ogTitle && <li>• Adaugă tag-ul og:title pentru un titlu personalizat pe social</li>}
            {!social.ogDescription && <li>• Adaugă og:description pentru o descriere atractivă</li>}
            {!social.twitterCard && <li>• Adaugă twitter:card cu valoarea "summary_large_image"</li>}
            {!social.twitterImage && <li>• Adaugă twitter:image pentru preview pe Twitter/X</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
