'use client';

import { useEffect, useState } from 'react';
import { Loader2, Wifi, Gauge, FileSearch, CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 1, label: 'Conectare la server...', icon: Wifi },
  { id: 2, label: 'Analiză viteză...', icon: Gauge },
  { id: 3, label: 'Scanare conținut...', icon: FileSearch },
  { id: 4, label: 'Generare raport...', icon: CheckCircle2 },
];

export function LoadingProgress() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) return prev + Math.random() * 10;
        return prev;
      });
    }, 200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card rounded-2xl p-8 shadow-xl border border-border/50">
        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={352}
              strokeDashoffset={352 - (352 * progress) / 100}
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold gradient-text">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-accent border border-primary/20'
                    : isComplete
                    ? 'bg-success/10'
                    : 'opacity-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isComplete
                      ? 'bg-success text-success-foreground'
                      : isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isActive ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isComplete ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`font-medium ${
                    isActive ? 'text-foreground' : isComplete ? 'text-success' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
