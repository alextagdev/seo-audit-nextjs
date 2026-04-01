'use client';

import { FileJson, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { SchemaAnalysis } from '@/lib/types/audit';
import { StatusBadge } from './StatusBadge';

interface SchemaSectionProps {
  schema: SchemaAnalysis;
}

export function SchemaSection({ schema }: SchemaSectionProps) {
  const schemaTypes = [
    { label: 'Organization', value: schema.hasOrganization },
    { label: 'Breadcrumb', value: schema.hasBreadcrumb },
    { label: 'Article', value: schema.hasArticle },
    { label: 'FAQ', value: schema.hasFAQ },
    { label: 'HowTo', value: schema.hasHowTo },
    { label: 'LocalBusiness', value: schema.hasLocalBusiness },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileJson className="w-6 h-6 text-primary" />
          <div>
            <CardTitle>Schema.org Markup</CardTitle>
            <CardDescription>
              Structured data pentru motoare de căutare
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* JSON-LD Status */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <span className="font-medium">JSON-LD Detectat</span>
          <StatusBadge status={schema.hasJsonLd ? 'ok' : 'fix'} />
        </div>

        {/* Schema Types Detected */}
        {schema.schemaTypes.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Tipuri Schema Detectate</h4>
            <div className="flex flex-wrap gap-2">
              {schema.schemaTypes.map((type, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Schema Types Grid */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Schema Types</h4>
          <div className="grid grid-cols-2 gap-3">
            {schemaTypes.map((type, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg"
              >
                {type.value ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <span className="text-sm">{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Errors */}
        {schema.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-destructive">Erori Schema</h4>
            <ul className="space-y-1">
              {schema.errors.map((error, index) => (
                <li
                  key={index}
                  className="text-sm text-destructive flex items-start gap-2"
                >
                  <span className="mt-0.5">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {schema.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Recomandări Schema</h4>
            <ul className="space-y-2">
              {schema.recommendations.slice(0, 3).map((rec, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary font-bold mt-0.5">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
