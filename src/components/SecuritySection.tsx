'use client';

import { Shield, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { SecurityAnalysis } from '@/lib/types/audit';
import { Progress } from './ui/progress';

interface SecuritySectionProps {
  security: SecurityAnalysis;
}

export function SecuritySection({ security }: SecuritySectionProps) {
  const percentage = (security.score / security.maxScore) * 100;

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

  const headers = [
    { name: 'Content-Security-Policy', value: security.securityHeaders.contentSecurityPolicy },
    { name: 'X-Frame-Options', value: security.securityHeaders.xFrameOptions },
    { name: 'X-Content-Type-Options', value: security.securityHeaders.xContentTypeOptions },
    { name: 'Strict-Transport-Security', value: security.securityHeaders.strictTransportSecurity },
    { name: 'X-XSS-Protection', value: security.securityHeaders.xXssProtection },
    { name: 'Referrer-Policy', value: security.securityHeaders.referrerPolicy },
    { name: 'Permissions-Policy', value: security.securityHeaders.permissionsPolicy },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-600" />
          <div>
            <CardTitle>Security Analysis</CardTitle>
            <CardDescription>
              HTTP security headers și configurații SSL/TLS
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Security Score</span>
            <span className={`text-lg font-bold ${getScoreColor()}`}>
              {security.score}/{security.maxScore}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">{getScoreLabel()}</p>
        </div>

        {/* HTTPS & HSTS */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">SSL/TLS Configuration</h4>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm">HTTPS Enabled</span>
            {security.https ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm">HSTS Enabled</span>
            {security.hsts ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>

          {security.hsts && security.hstsMaxAge && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">HSTS Max-Age:</span>{' '}
                {Math.round(security.hstsMaxAge / (365 * 24 * 60 * 60) * 10) / 10} years
              </p>
              {security.hstsMaxAge >= 31536000 && (
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  ✓ Recommended: ≥ 1 year
                </p>
              )}
            </div>
          )}
        </div>

        {/* Security Headers */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">HTTP Security Headers</h4>
          <div className="space-y-2">
            {headers.map((header, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <span className="text-xs font-mono">{header.name}</span>
                {header.value ? (
                  <Badge variant="default" className="bg-green-600">Present</Badge>
                ) : (
                  <Badge variant="destructive">Missing</Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mixed Content */}
        {security.mixedContent.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <h4 className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                Mixed Content Detected
              </h4>
            </div>
            <p className="text-xs text-muted-foreground">
              {security.mixedContent.length} HTTP resources on HTTPS page
            </p>
            <div className="space-y-1">
              {security.mixedContent.slice(0, 3).map((url, index) => (
                <p key={index} className="text-xs font-mono text-yellow-700 dark:text-yellow-300 truncate">
                  {url}
                </p>
              ))}
              {security.mixedContent.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  ...and {security.mixedContent.length - 3} more
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
