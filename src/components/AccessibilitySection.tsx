'use client';

import { Accessibility, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { AccessibilityAnalysis } from '@/lib/types/audit';

interface AccessibilitySectionProps {
  accessibility: AccessibilityAnalysis;
}

export function AccessibilitySection({ accessibility }: AccessibilitySectionProps) {
  const percentage = (accessibility.score / accessibility.maxScore) * 100;

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = () => {
    if (percentage >= 80) return 'Excelent';
    if (percentage >= 50) return 'Bun';
    return 'Necesită îmbunătățire';
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'serious': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'minor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const checks = [
    { label: 'Lang Attribute', value: accessibility.checks.hasLangAttribute },
    { label: 'Images Alt Text', value: accessibility.checks.imagesHaveAlt },
    { label: 'Links Text', value: accessibility.checks.linksHaveText },
    { label: 'Button Names', value: accessibility.checks.buttonsHaveAccessibleNames },
    { label: 'ARIA Labels', value: accessibility.checks.hasAriaLabels },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Accessibility className="w-6 h-6 text-indigo-600" />
          <div>
            <CardTitle>Accessibility Analysis</CardTitle>
            <CardDescription>
              WCAG compliance și accessibility checks
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Accessibility Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Accessibility Score</span>
            <span className={`text-lg font-bold ${getScoreColor()}`}>
              {accessibility.score}/{accessibility.maxScore}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">{getScoreLabel()}</p>
        </div>

        {/* Quick Checks */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Quick Checks</h4>
          <div className="grid grid-cols-2 gap-2">
            {checks.map((check, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg"
              >
                {check.value ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span className="text-xs">{check.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Issues */}
        {accessibility.issues.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <h4 className="text-sm font-semibold">Issues Found ({accessibility.issues.length})</h4>
            </div>
            <div className="space-y-2">
              {accessibility.issues.map((issue, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted/50 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge className={getIssueColor(issue.type)}>
                      {issue.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs font-semibold">{issue.count} affected</span>
                  </div>
                  <p className="text-sm">{issue.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {accessibility.issues.length === 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              No accessibility issues found!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
