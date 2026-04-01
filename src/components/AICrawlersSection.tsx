'use client';

import { Bot, CheckCircle2, XCircle, MinusCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AICrawlerAccess } from '@/lib/types/audit';

interface AICrawlersSectionProps {
  aiCrawlers: AICrawlerAccess;
}

export function AICrawlersSection({ aiCrawlers }: AICrawlersSectionProps) {
  const allowedCount = aiCrawlers.crawlers.filter(c => c.allowed).length;
  const blockedCount = aiCrawlers.crawlers.filter(c => c.blocked).length;
  const unspecifiedCount = aiCrawlers.crawlers.filter(c => !c.allowed && !c.blocked).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          <div>
            <CardTitle>AI Crawler Access</CardTitle>
            <CardDescription>
              robots.txt și permisiuni pentru AI crawlers
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {allowedCount}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">Allowed</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
              {blockedCount}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">Blocked</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {unspecifiedCount}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Unspecified</p>
          </div>
        </div>

        {/* robots.txt & llms.txt */}
        <div className="flex gap-3">
          <div className="flex-1 p-3 bg-muted/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">robots.txt</span>
            </div>
            {aiCrawlers.robotsTxtExists ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
          <div className="flex-1 p-3 bg-muted/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">llms.txt</span>
            </div>
            {aiCrawlers.llmsTxtExists ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Crawler List */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">AI Crawlers ({aiCrawlers.crawlers.length})</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {aiCrawlers.crawlers.map((crawler, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {crawler.allowed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  ) : crawler.blocked ? (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  ) : (
                    <MinusCircle className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{crawler.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {crawler.userAgent}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    crawler.allowed ? 'default' :
                    crawler.blocked ? 'destructive' :
                    'secondary'
                  }
                  className={
                    crawler.allowed ? 'bg-green-600' :
                    crawler.blocked ? '' :
                    'bg-gray-500'
                  }
                >
                  {crawler.allowed ? 'Allowed' : crawler.blocked ? 'Blocked' : 'Unspecified'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <span className="font-semibold">💡 Tip:</span> Allowing AI crawlers can help your content
            appear in AI-generated responses (ChatGPT, Claude, Perplexity). Consider adding llms.txt
            for better AI optimization.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
