import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const variantStyles = {
  default: 'from-primary/10 to-primary/5 border-primary/20',
  success: 'from-success/10 to-success/5 border-success/20',
  warning: 'from-warning/10 to-warning/5 border-warning/20',
  error: 'from-destructive/10 to-destructive/5 border-destructive/20',
};

const iconStyles = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-destructive/10 text-destructive',
};

export function StatsCard({ title, value, subtitle, icon: Icon, variant = 'default' }: StatsCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${variantStyles[variant]} border p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconStyles[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
