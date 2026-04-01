'use client';

import { Package, FileCode, Palette, Image, Type, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ResourceBreakdown } from '@/lib/types/audit';

interface ResourcesSectionProps {
  resources: ResourceBreakdown;
}

export function ResourcesSection({ resources }: ResourcesSectionProps) {
  const resourceTypes = [
    { label: 'HTML', count: resources.html, icon: FileCode, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { label: 'JavaScript', count: resources.javascript, icon: FileCode, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { label: 'CSS', count: resources.css, icon: Palette, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Images', count: resources.images, icon: Image, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Fonts', count: resources.fonts, icon: Type, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: 'Other', count: resources.other, icon: Package, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" />
          <div>
            <CardTitle>Resource Breakdown</CardTitle>
            <CardDescription>
              Analiza resurselor HTTP și third-party domains
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Requests */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total HTTP Requests</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {resources.totalRequests}
              </p>
            </div>
            <Package className="w-12 h-12 text-blue-300 dark:text-blue-700" />
          </div>
        </div>

        {/* Resource Types Grid */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Resource Types</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {resourceTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div
                  key={index}
                  className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded ${type.bgColor}`}>
                      <Icon className={`w-3.5 h-3.5 ${type.color}`} />
                    </div>
                    <span className="text-xs font-medium">{type.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{type.count}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Third-Party Domains */}
        {resources.thirdParty.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">
                Third-Party Domains ({resources.thirdParty.length})
              </h4>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {resources.thirdParty.map((domain, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                >
                  <span className="text-sm font-mono text-muted-foreground truncate">
                    {domain}
                  </span>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    External
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Tip */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-900 dark:text-yellow-100">
            <span className="font-semibold">⚠️ Performance Tip:</span>{' '}
            {resources.totalRequests > 50
              ? 'Consider reducing the number of HTTP requests for better performance.'
              : 'Good! Your page has a reasonable number of requests.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
