import { LucideIcon } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface AuditItem {
  label: string;
  value?: string;
  status: 'ok' | 'fix' | 'warning';
  description?: string;
}

interface AuditSectionProps {
  title: string;
  icon: LucideIcon;
  items: AuditItem[];
}

export function AuditSection({ title, icon: Icon, items }: AuditSectionProps) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">{item.label}</span>
                {item.value && (
                  <span className="text-sm text-muted-foreground">({item.value})</span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              )}
            </div>
            <StatusBadge status={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
