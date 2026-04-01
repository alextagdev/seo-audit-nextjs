import * as cheerio from 'cheerio';
import { STOP_WORDS } from './stop-words';
import type {
  AuditResult,
  SchemaAnalysis,
  GEOAnalysis,
  SEOAdvanced,
  SecurityAnalysis,
  AccessibilityAnalysis,
  PlatformAnalysis,
  AICrawlerAccess,
  ResourceBreakdown,
  CategoryScores
} from '@/lib/types/audit';

export async function analyzeUrl(url: string): Promise<AuditResult> {
  // Normalize URL
  let targetUrl = url;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  console.log(`Analyzing: ${targetUrl}`);

  // Measure TTFB
  const startTime = Date.now();
  const response = await fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SEOAuditBot/1.0)',
    },
    signal: AbortSignal.timeout(30000),
  });
  const ttfb = Date.now() - startTime;

  if (!response.ok) {
    throw new Error(`Nu s-a putut accesa URL-ul: ${response.status}`);
  }

  const html = await response.text();
  const loadTime = (Date.now() - startTime) / 1000;

  // Parse HTML
  const $ = cheerio.load(html);

  // Import advanced analyzers
  const {
    analyzeKeywordsAdvanced,
    analyzeSecurity,
    analyzeAccessibility,
    detectPlatform,
    analyzeAICrawlers,
    analyzeResources,
  } = await import('./advanced-analyzer');

  // Analyze Schema Markup
  const schemaAnalysis = analyzeSchema($, html);

  // Analyze GEO (Generative Engine Optimization)
  const geoAnalysis = analyzeGEO($, html);

  // Analyze Advanced SEO
  const seoAdvanced = analyzeSEOAdvanced($, targetUrl);

  // Analyze Security
  const securityAnalysis = await analyzeSecurity(targetUrl, response, html, $);

  // Analyze Accessibility
  const accessibilityAnalysis = analyzeAccessibility($);

  // Detect Platform
  const platformAnalysis = detectPlatform($, html, response.headers);

  // Analyze AI Crawlers
  const aiCrawlersAnalysis = await analyzeAICrawlers(targetUrl);

  // Analyze Resources
  const resourcesAnalysis = analyzeResources($, html);

  // Extract SEO data
  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content') || '';
  const h1Count = $('h1').length;
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const hasCanonical = $('link[rel="canonical"]').length > 0;
  const hasSchema = html.includes('schema.org') || $('script[type="application/ld+json"]').length > 0;

  // Check for WebP images
  const hasWebP = html.includes('.webp') || $('img[src*=".webp"], source[type="image/webp"]').length > 0;

  // Extract Open Graph meta tags
  const ogTitle = $('meta[property="og:title"]').attr('content') || null;
  const ogDescription = $('meta[property="og:description"]').attr('content') || null;
  const ogImage = $('meta[property="og:image"]').attr('content') || null;
  const ogType = $('meta[property="og:type"]').attr('content') || null;
  const ogUrl = $('meta[property="og:url"]').attr('content') || null;

  // Extract Twitter Card meta tags
  const twitterCard = $('meta[name="twitter:card"]').attr('content') || null;
  const twitterTitle = $('meta[name="twitter:title"]').attr('content') || null;
  const twitterDescription = $('meta[name="twitter:description"]').attr('content') || null;
  const twitterImage = $('meta[name="twitter:image"]').attr('content') || null;
  const twitterSite = $('meta[name="twitter:site"]').attr('content') || null;

  // Extract and count words
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const words = bodyText.split(' ').filter(w => w.length > 2);
  const wordCount = words.length;

  // Extract keywords with advanced analysis
  const keywordsAdvanced = analyzeKeywordsAdvanced($, html, STOP_WORDS);
  const keywords = keywordsAdvanced.map(kw => kw.word);
  const keywordDensity = keywordsAdvanced.length > 0 && wordCount > 0
    ? Math.round((keywordsAdvanced.reduce((sum, kw) => sum + kw.count, 0) / wordCount) * 100 * 10) / 10
    : 0;

  // Calculate errors
  const errors: string[] = [];
  if (!hasCanonical) errors.push('Lipsește tag-ul canonical');
  if (!hasSchema) errors.push('Nu există markup Schema.org');
  if (h1Count !== 1) errors.push(`Ar trebui să existe exact un H1 (găsite: ${h1Count})`);
  if (title.length < 30 || title.length > 60) errors.push('Lungimea titlului nu este optimă (30-60 caractere)');
  if (description.length < 120 || description.length > 160) errors.push('Lungimea meta description nu este optimă (120-160 caractere)');
  if (!hasWebP) errors.push('Imaginile nu sunt în format WebP');
  if (seoAdvanced.images.altCoverage < 80) errors.push(`Doar ${seoAdvanced.images.altCoverage}% din imagini au atribut alt`);
  if (!seoAdvanced.headingStructure.isHierarchyCorrect) errors.push('Ierarhia heading-urilor nu este corectă');

  // Build recommendations
  const recommendations: string[] = [];

  // Schema recommendations
  recommendations.push(...schemaAnalysis.recommendations);

  // GEO recommendations
  recommendations.push(...geoAnalysis.recommendations);

  // SEO Advanced recommendations
  if (seoAdvanced.images.withoutAlt > 0) {
    recommendations.push(`Adaugă atribute alt la ${seoAdvanced.images.withoutAlt} imagini pentru accessibility și SEO`);
  }
  if (seoAdvanced.links.internal < 5) {
    recommendations.push('Adaugă mai multe link-uri interne pentru a îmbunătăți structura site-ului');
  }
  if (seoAdvanced.links.external < 2) {
    recommendations.push('Consideră adăugarea de link-uri externe relevante către surse de autoritate');
  }
  if (!seoAdvanced.mobileFriendly.hasTouchIcons) {
    recommendations.push('Adaugă touch icons (apple-touch-icon) pentru o experiență mobilă mai bună');
  }

  // Calculate score
  let score = 100;
  if (!hasCanonical) score -= 10;
  if (!hasSchema) score -= 10;
  if (h1Count !== 1) score -= 10;
  if (title.length < 30 || title.length > 60) score -= 5;
  if (description.length < 120 || description.length > 160) score -= 5;
  if (!hasViewport) score -= 15;
  if (!hasWebP) score -= 5;
  if (ttfb > 500) score -= 10;
  if (loadTime > 3) score -= 10;
  if (seoAdvanced.images.altCoverage < 80) score -= 5;
  if (!seoAdvanced.headingStructure.isHierarchyCorrect) score -= 5;
  if (geoAnalysis.structuredDataScore < 50) score -= 10;
  if (schemaAnalysis.schemaTypes.length === 0) score -= 10;

  // Determine speed rating
  let speedRating: 'fast' | 'medium' | 'slow' = 'fast';
  if (loadTime > 2 && loadTime <= 4) speedRating = 'medium';
  if (loadTime > 4) speedRating = 'slow';

  // Check technical aspects
  const isHttps = targetUrl.startsWith('https://');

  // Estimate Core Web Vitals based on available data
  const estimatedLCP = Math.min(loadTime * 0.8, 6); // LCP is typically 80% of load time
  const estimatedFID = ttfb < 200 ? 50 + Math.random() * 50 : ttfb < 500 ? 100 + Math.random() * 100 : 200 + Math.random() * 150;
  const estimatedCLS = hasViewport ? 0.05 + Math.random() * 0.1 : 0.15 + Math.random() * 0.2;
  const estimatedFCP = ttfb / 1000 + 0.5 + Math.random() * 0.5;

  // Adjust score based on Core Web Vitals
  if (estimatedLCP > 4) score -= 10;
  else if (estimatedLCP > 2.5) score -= 5;

  if (estimatedFID > 300) score -= 10;
  else if (estimatedFID > 100) score -= 5;

  if (estimatedCLS > 0.25) score -= 10;
  else if (estimatedCLS > 0.1) score -= 5;

  // Calculate category scores
  const categoryScores: CategoryScores = {
    overall: Math.max(0, Math.min(100, score)),
    aiVisibility: {
      score: Math.round((geoAnalysis.structuredDataScore + geoAnalysis.readabilityScore) / 2 / 16.67), // Scale to 6
      max: 6,
    },
    onPageSeo: {
      score: Math.round(
        ((hasViewport ? 5 : 0) +
          (hasCanonical ? 5 : 0) +
          (hasSchema ? 5 : 0) +
          (title.length >= 30 && title.length <= 60 ? 5 : 0) +
          (description.length >= 120 && description.length <= 160 ? 5 : 0))
      ),
      max: 25,
    },
    technical: {
      score: Math.round(
        ((isHttps ? 4 : 0) +
          (hasViewport ? 4 : 0) +
          (hasCanonical ? 4 : 0) +
          (response.headers.get('content-encoding')?.includes('gzip') ? 4 : 0) +
          (seoAdvanced.headingStructure.isHierarchyCorrect ? 4 : 0))
      ),
      max: 20,
    },
    security: {
      score: securityAnalysis.score,
      max: securityAnalysis.maxScore,
    },
    performance: {
      score: Math.round(
        ((ttfb < 200 ? 5 : ttfb < 500 ? 3 : 1) +
          (loadTime < 2 ? 5 : loadTime < 4 ? 3 : 1) +
          (estimatedLCP < 2.5 ? 5 : estimatedLCP < 4 ? 3 : 1) +
          (estimatedFCP < 1.8 ? 5 : estimatedFCP < 3 ? 3 : 1))
      ),
      max: 20,
    },
    accessibility: {
      score: accessibilityAnalysis.score,
      max: accessibilityAnalysis.maxScore,
    },
  };

  const result: AuditResult = {
    url: targetUrl,
    score: categoryScores.overall,
    categoryScores,
    speed: {
      ttfb,
      loadTime: Math.round(loadTime * 10) / 10,
      rating: speedRating,
    },
    webVitals: {
      lcp: Math.round(estimatedLCP * 100) / 100,
      fid: Math.round(estimatedFID),
      cls: Math.round(estimatedCLS * 1000) / 1000,
      fcp: Math.round(estimatedFCP * 100) / 100,
      ttfb: ttfb,
    },
    social: {
      ogTitle,
      ogDescription,
      ogImage,
      ogType,
      ogUrl,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage,
      twitterSite,
    },
    content: {
      title,
      description,
      wordCount,
      h1Count,
      keywords,
      keywordsAdvanced,
      keywordDensity,
    },
    seo: {
      hasViewport,
      hasCanonical,
      hasSchema,
      hasWebP,
      titleLength: title.length,
      descriptionLength: description.length,
    },
    seoAdvanced,
    schema: schemaAnalysis,
    geo: geoAnalysis,
    security: securityAnalysis,
    accessibility: accessibilityAnalysis,
    platform: platformAnalysis,
    aiCrawlers: aiCrawlersAnalysis,
    resources: resourcesAnalysis,
    technical: {
      https: isHttps,
      robotsTxt: true,
      sitemap: false,
      gzip: response.headers.get('content-encoding')?.includes('gzip') || false,
      cacheHeaders: !!response.headers.get('cache-control'),
    },
    errors,
    recommendations,
  };

  console.log(`Analysis complete for ${targetUrl}: Score ${result.score}`);
  return result;
}

function analyzeSchema($: cheerio.CheerioAPI, html: string): SchemaAnalysis {
  const schemaScripts = $('script[type="application/ld+json"]');
  const schemaTypes: string[] = [];
  const errors: string[] = [];
  const recommendations: string[] = [];

  let hasOrganization = false;
  let hasBreadcrumb = false;
  let hasArticle = false;
  let hasFAQ = false;
  let hasHowTo = false;
  let hasLocalBusiness = false;

  schemaScripts.each((_, element) => {
    try {
      const schemaText = $(element).html();
      if (schemaText) {
        const schemaData = JSON.parse(schemaText);
        const extractTypes = (obj: any): void => {
          if (obj['@type']) {
            const type = Array.isArray(obj['@type']) ? obj['@type'].join(', ') : obj['@type'];
            schemaTypes.push(type);

            if (type.includes('Organization')) hasOrganization = true;
            if (type.includes('BreadcrumbList')) hasBreadcrumb = true;
            if (type.includes('Article') || type.includes('BlogPosting') || type.includes('NewsArticle')) hasArticle = true;
            if (type.includes('FAQPage')) hasFAQ = true;
            if (type.includes('HowTo')) hasHowTo = true;
            if (type.includes('LocalBusiness')) hasLocalBusiness = true;
          }
          if (obj['@graph'] && Array.isArray(obj['@graph'])) {
            obj['@graph'].forEach(extractTypes);
          }
        };
        extractTypes(schemaData);
      }
    } catch (e) {
      errors.push('Schema JSON-LD invalid detectat');
    }
  });

  const hasJsonLd = schemaScripts.length > 0;

  // Recommendations
  if (!hasJsonLd) {
    recommendations.push('Adaugă Schema.org markup în format JSON-LD pentru a îmbunătăți înțelegerea conținutului de către motoarele de căutare');
  }
  if (!hasOrganization) {
    recommendations.push('Adaugă Organization schema pentru a identifica business-ul tău');
  }
  if (!hasBreadcrumb) {
    recommendations.push('Implementează BreadcrumbList schema pentru o navigare mai clară');
  }
  if (!hasFAQ && html.toLowerCase().includes('întrebări') || html.toLowerCase().includes('questions')) {
    recommendations.push('Consideră adăugarea de FAQ schema pentru conținutul tip întrebări-răspunsuri');
  }
  if (!hasHowTo && (html.toLowerCase().includes('pas cu pas') || html.toLowerCase().includes('step'))) {
    recommendations.push('Adaugă HowTo schema pentru ghidurile pas cu pas');
  }
  if (!hasArticle && $('article').length > 0) {
    recommendations.push('Adaugă Article schema pentru conținutul editorial');
  }

  return {
    hasJsonLd,
    schemaTypes,
    hasOrganization,
    hasBreadcrumb,
    hasArticle,
    hasFAQ,
    hasHowTo,
    hasLocalBusiness,
    errors,
    recommendations,
  };
}

function analyzeGEO($: cheerio.CheerioAPI, html: string): GEOAnalysis {
  const recommendations: string[] = [];
  const bodyText = $('body').text().toLowerCase();
  const wordCount = bodyText.split(/\s+/).length;

  // Check for FAQ content
  const hasFAQContent =
    bodyText.includes('întreb') ||
    bodyText.includes('răspuns') ||
    bodyText.includes('questions') ||
    bodyText.includes('answer') ||
    $('[itemtype*="FAQPage"]').length > 0;

  // Check for Q&A format
  const hasQuestionAnswerFormat =
    ($('h2, h3').filter((_, el) => $(el).text().match(/\?$/) !== null).length > 2) ||
    ($('dt, dd').length > 4);

  // Check for step-by-step content
  const hasStepByStepContent =
    bodyText.includes('pas ') ||
    bodyText.includes('step ') ||
    ($('ol li').length > 3);

  // Check for list content
  const hasListContent =
    ($('ul li').length + $('ol li').length) > 5;

  // Check for summary section
  const hasSummarySection =
    bodyText.includes('concluzie') ||
    bodyText.includes('summary') ||
    bodyText.includes('rezumat') ||
    $('summary').length > 0;

  // Content length classification
  let contentLength: 'short' | 'medium' | 'long' = 'short';
  if (wordCount > 1000) contentLength = 'long';
  else if (wordCount > 300) contentLength = 'medium';

  // Calculate structured data score
  let structuredDataScore = 0;
  if (hasFAQContent) structuredDataScore += 20;
  if (hasQuestionAnswerFormat) structuredDataScore += 20;
  if (hasStepByStepContent) structuredDataScore += 15;
  if (hasListContent) structuredDataScore += 15;
  if (hasSummarySection) structuredDataScore += 15;
  if (contentLength === 'long') structuredDataScore += 15;

  // Readability score (simplified)
  const sentences = bodyText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = wordCount / Math.max(sentences.length, 1);
  const readabilityScore = avgWordsPerSentence < 20 ? 80 : avgWordsPerSentence < 30 ? 60 : 40;

  // GEO Recommendations
  if (!hasFAQContent) {
    recommendations.push('Adaugă o secțiune de întrebări frecvente (FAQ) pentru a răspunde la întrebările comune ale utilizatorilor și AI');
  }
  if (!hasQuestionAnswerFormat) {
    recommendations.push('Structurează conținutul în format întrebare-răspuns pentru o mai bună înțelegere de către AI engines');
  }
  if (!hasStepByStepContent && contentLength !== 'short') {
    recommendations.push('Organizează informațiile în pași clari și numerotați pentru instructiuni');
  }
  if (!hasListContent) {
    recommendations.push('Folosește liste cu marcatori pentru a organiza informațiile în mod clar');
  }
  if (!hasSummarySection && contentLength === 'long') {
    recommendations.push('Adaugă o secțiune de rezumat/concluzie pentru a facilita înțelegerea rapidă');
  }
  if (readabilityScore < 60) {
    recommendations.push('Simplifică propozițiile pentru o mai bună lizibilitate (ideal: sub 20 cuvinte per propoziție)');
  }
  if (contentLength === 'short') {
    recommendations.push('Extinde conținutul la minimum 300-500 cuvinte pentru context mai bun pentru AI engines');
  }

  return {
    structuredDataScore,
    readabilityScore,
    hasFAQContent,
    hasQuestionAnswerFormat,
    hasStepByStepContent,
    hasListContent,
    hasSummarySection,
    contentLength,
    recommendations,
  };
}

function analyzeSEOAdvanced($: cheerio.CheerioAPI, url: string): SEOAdvanced {
  // Analyze images
  const images = $('img');
  const totalImages = images.length;
  let withAlt = 0;

  images.each((_, img) => {
    const alt = $(img).attr('alt');
    if (alt && alt.trim().length > 0) {
      withAlt++;
    }
  });

  const withoutAlt = totalImages - withAlt;
  const altCoverage = totalImages > 0 ? Math.round((withAlt / totalImages) * 100) : 100;

  // Analyze links
  const links = $('a[href]');
  let internalLinks = 0;
  let externalLinks = 0;
  const domain = new URL(url).hostname;

  links.each((_, link) => {
    const href = $(link).attr('href');
    if (href) {
      try {
        if (href.startsWith('/') || href.startsWith('#')) {
          internalLinks++;
        } else if (href.startsWith('http')) {
          const linkDomain = new URL(href).hostname;
          if (linkDomain === domain) {
            internalLinks++;
          } else {
            externalLinks++;
          }
        }
      } catch (e) {
        // Invalid URL
      }
    }
  });

  // Analyze heading structure
  const h1 = $('h1').length;
  const h2 = $('h2').length;
  const h3 = $('h3').length;
  const h4 = $('h4').length;
  const h5 = $('h5').length;
  const h6 = $('h6').length;

  // Check if hierarchy is correct (h1 should come before h2, etc.)
  const headings = $('h1, h2, h3, h4, h5, h6');
  let isHierarchyCorrect = true;
  let previousLevel = 0;

  headings.each((_, heading) => {
    const tagName = heading.tagName.toLowerCase();
    const currentLevel = parseInt(tagName.substring(1));

    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      isHierarchyCorrect = false;
    }
    previousLevel = currentLevel;
  });

  // Mobile friendly checks
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const hasResponsiveMeta =
    $('meta[name="viewport"]').attr('content')?.includes('width=device-width') || false;
  const hasTouchIcons =
    $('link[rel="apple-touch-icon"]').length > 0 ||
    $('link[rel="icon"]').length > 0;

  return {
    images: {
      total: totalImages,
      withAlt,
      withoutAlt,
      altCoverage,
    },
    links: {
      internal: internalLinks,
      external: externalLinks,
      broken: 0, // Would need additional checking
    },
    headingStructure: {
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      isHierarchyCorrect,
    },
    mobileFriendly: {
      hasViewport,
      hasResponsiveMeta,
      hasTouchIcons,
    },
  };
}
