import { Tag } from 'lucide-react';

interface KeywordsSectionProps {
  keywords: string[];
}

export function KeywordsSection({ keywords }: KeywordsSectionProps) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Tag className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Cuvinte Cheie Detectate</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className="px-3 py-1.5 bg-accent rounded-full text-sm font-medium text-accent-foreground hover:bg-primary/20 transition-colors cursor-default"
          >
            {keyword}
          </span>
        ))}
      </div>
      
      {keywords.length === 0 && (
        <p className="text-muted-foreground text-sm">Nu s-au detectat cuvinte cheie relevante.</p>
      )}
    </div>
  );
}
