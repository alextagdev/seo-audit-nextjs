import { Check, X, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'ok' | 'fix' | 'warning';
  label?: string;
}

const statusConfig = {
  ok: {
    icon: Check,
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success/20',
    label: 'OK',
  },
  fix: {
    icon: X,
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/20',
    label: 'FIX',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/20',
    label: 'ATENȚIE',
  },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
      <Icon className="w-3 h-3" />
      {label || config.label}
    </span>
  );
}
