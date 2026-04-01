'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Shield, Zap, FileCheck, Lock, Gauge, Accessibility } from 'lucide-react';
import { CategoryScores } from '@/lib/types/audit';

interface CategoryScoresSectionProps {
  categoryScores: CategoryScores;
}

export function CategoryScoresSection({ categoryScores }: CategoryScoresSectionProps) {
  const categories = [
    {
      name: 'AI Visibility (GEO)',
      score: categoryScores.aiVisibility.score,
      max: categoryScores.aiVisibility.max,
      icon: Gauge,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'On-Page SEO',
      score: categoryScores.onPageSeo.score,
      max: categoryScores.onPageSeo.max,
      icon: FileCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Technical',
      score: categoryScores.technical.score,
      max: categoryScores.technical.max,
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Security',
      score: categoryScores.security.score,
      max: categoryScores.security.max,
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Performance',
      score: categoryScores.performance.score,
      max: categoryScores.performance.max,
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Accessibility',
      score: categoryScores.accessibility.score,
      max: categoryScores.accessibility.max,
      icon: Accessibility,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  const getPercentage = (score: number, max: number) => {
    return (score / max) * 100;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Breakdown pe Categorii</CardTitle>
        <CardDescription>
          Scor global: {categoryScores.overall}/100
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((category, index) => {
          const percentage = getPercentage(category.score, category.max);
          const Icon = category.icon;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <Icon className={`w-4 h-4 ${category.color}`} />
                  </div>
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(percentage)}`}>
                    {category.score}
                  </span>
                  <span className="text-sm text-muted-foreground">/ {category.max}</span>
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
