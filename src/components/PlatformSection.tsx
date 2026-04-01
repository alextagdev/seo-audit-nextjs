'use client';

import { Server, Code, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { PlatformAnalysis } from '@/lib/types/audit';

interface PlatformSectionProps {
  platform: PlatformAnalysis;
}

export function PlatformSection({ platform }: PlatformSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Server className="w-6 h-6 text-purple-600" />
          <div>
            <CardTitle>Platform Detection</CardTitle>
            <CardDescription>
              Identificare automată tehnologii și infrastructură
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* CMS */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold">Content Management System</h4>
          </div>
          {platform.cms ? (
            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">{platform.cms}</span>
                <Badge variant="secondary">Detected</Badge>
              </div>
              {platform.theme && (
                <p className="text-sm text-muted-foreground mt-2">
                  Theme: <span className="font-medium">{platform.theme}</span>
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
              No CMS detected or custom built
            </p>
          )}
        </div>

        {/* Frameworks */}
        {platform.frameworks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Frameworks & Libraries</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {platform.frameworks.map((framework, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-950">
                  {framework}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Infrastructure */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Infrastructure</h4>

          <div className="grid grid-cols-2 gap-3">
            {/* Server */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Server</p>
              <p className="text-sm font-medium">
                {platform.server || 'Not detected'}
              </p>
            </div>

            {/* CDN */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">CDN</p>
              <p className="text-sm font-medium">
                {platform.cdn || 'Not detected'}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-sm">
            <span className="font-semibold">Tech Stack:</span>{' '}
            {[
              platform.cms,
              ...(platform.frameworks || []),
              platform.cdn
            ].filter(Boolean).join(' + ') || 'Custom/Unknown'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
