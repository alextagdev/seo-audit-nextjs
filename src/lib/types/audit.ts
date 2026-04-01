export interface CoreWebVitals {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
}

export interface SocialMeta {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogType: string | null;
  ogUrl: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  twitterSite: string | null;
}

export interface SchemaAnalysis {
  hasJsonLd: boolean;
  schemaTypes: string[];
  hasOrganization: boolean;
  hasBreadcrumb: boolean;
  hasArticle: boolean;
  hasFAQ: boolean;
  hasHowTo: boolean;
  hasLocalBusiness: boolean;
  errors: string[];
  recommendations: string[];
}

export interface GEOAnalysis {
  structuredDataScore: number;
  readabilityScore: number;
  hasFAQContent: boolean;
  hasQuestionAnswerFormat: boolean;
  hasStepByStepContent: boolean;
  hasListContent: boolean;
  hasSummarySection: boolean;
  contentLength: 'short' | 'medium' | 'long';
  recommendations: string[];
}

export interface SEOAdvanced {
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    altCoverage: number;
  };
  links: {
    internal: number;
    external: number;
    broken: number;
  };
  headingStructure: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
    isHierarchyCorrect: boolean;
  };
  mobileFriendly: {
    hasViewport: boolean;
    hasResponsiveMeta: boolean;
    hasTouchIcons: boolean;
  };
}

export interface SecurityAnalysis {
  score: number;
  maxScore: number;
  https: boolean;
  hsts: boolean;
  hstsMaxAge: number | null;
  mixedContent: string[];
  securityHeaders: {
    contentSecurityPolicy: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
    strictTransportSecurity: boolean;
    xXssProtection: boolean;
    referrerPolicy: boolean;
    permissionsPolicy: boolean;
  };
  sslInfo: {
    valid: boolean;
    daysUntilExpiry: number | null;
  };
}

export interface AccessibilityAnalysis {
  score: number;
  maxScore: number;
  issues: {
    type: 'critical' | 'serious' | 'moderate' | 'minor';
    message: string;
    count: number;
  }[];
  checks: {
    hasAriaLabels: boolean;
    hasLangAttribute: boolean;
    imagesHaveAlt: boolean;
    linksHaveText: boolean;
    buttonsHaveAccessibleNames: boolean;
  };
}

export interface PlatformAnalysis {
  cms: string | null;
  theme: string | null;
  frameworks: string[];
  server: string | null;
  cdn: string | null;
}

export interface AICrawlerAccess {
  robotsTxtExists: boolean;
  llmsTxtExists: boolean;
  crawlers: {
    name: string;
    userAgent: string;
    allowed: boolean;
    blocked: boolean;
  }[];
}

export interface ResourceBreakdown {
  totalRequests: number;
  html: number;
  css: number;
  javascript: number;
  images: number;
  fonts: number;
  other: number;
  thirdParty: string[];
}

export interface CategoryScores {
  overall: number;
  aiVisibility: { score: number; max: number };
  onPageSeo: { score: number; max: number };
  technical: { score: number; max: number };
  security: { score: number; max: number };
  performance: { score: number; max: number };
  accessibility: { score: number; max: number };
}

export interface AuditResult {
  url: string;
  score: number;
  categoryScores?: CategoryScores;
  speed: {
    ttfb: number;
    loadTime: number;
    rating: 'fast' | 'medium' | 'slow';
  };
  webVitals: CoreWebVitals;
  social: SocialMeta;
  content: {
    title: string;
    description: string;
    wordCount: number;
    h1Count: number;
    keywords: string[];
    keywordsAdvanced?: Array<{ word: string; count: number; relevance: number }>;
    keywordDensity?: number;
  };
  seo: {
    hasViewport: boolean;
    hasCanonical: boolean;
    hasSchema: boolean;
    hasWebP: boolean;
    titleLength: number;
    descriptionLength: number;
  };
  seoAdvanced: SEOAdvanced;
  schema: SchemaAnalysis;
  geo: GEOAnalysis;
  security?: SecurityAnalysis;
  accessibility?: AccessibilityAnalysis;
  platform?: PlatformAnalysis;
  aiCrawlers?: AICrawlerAccess;
  resources?: ResourceBreakdown;
  technical: {
    https: boolean;
    robotsTxt: boolean;
    sitemap: boolean;
    gzip: boolean;
    cacheHeaders: boolean;
  };
  errors: string[];
  recommendations: string[];
  aiSummary?: string;
}

export interface SendReportRequest {
  email: string;
  auditData: AuditResult;
}
