import * as cheerio from 'cheerio';
import type {
  SecurityAnalysis,
  AccessibilityAnalysis,
  PlatformAnalysis,
  AICrawlerAccess,
  ResourceBreakdown,
} from '@/lib/types/audit';

export function analyzeKeywordsAdvanced(
  $: cheerio.CheerioAPI,
  html: string,
  stopWords: Set<string>
): Array<{ word: string; count: number; relevance: number }> {
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const titleText = $('title').text().toLowerCase();
  const h1Text = $('h1').text().toLowerCase();
  const h2Text = $('h2').text().toLowerCase();
  const metaDesc = $('meta[name="description"]').attr('content')?.toLowerCase() || '';

  const wordFrequency: Record<string, {
    count: number;
    inTitle: boolean;
    inH1: boolean;
    inH2: boolean;
    inMeta: boolean;
  }> = {};

  // HTML/CSS noise patterns to filter out
  const noisyPatterns = [
    /class/i, /div/i, /button/i, /container/i, /wrapper/i, /section/i,
    /nav/i, /header/i, /footer/i, /main/i, /aside/i, /span/i,
    /img/i, /svg/i, /icon/i, /btn/i, /link/i, /menu/i,
    /aria/i, /data/i, /attr/i, /prop/i, /ref/i, /id/i,
    /style/i, /css/i, /js/i, /script/i, /html/i,
    /\d{3,}/, // Numbers with 3+ digits
  ];

  // Check if word looks like HTML/CSS artifact
  const isNoisyWord = (word: string): boolean => {
    // Check against noisy patterns
    if (noisyPatterns.some(pattern => pattern.test(word))) return true;

    // Filter out camelCase/PascalCase (e.g., "classpswpbutton", "divContainer")
    if (/[a-z][A-Z]/.test(word) || /[A-Z]{2,}/.test(word)) return true;

    // Filter out words with unusual character density (too many consonants)
    const vowels = word.match(/[aeiouăâîșțAEIOUĂÂÎȘȚ]/g);
    if (word.length > 5 && (!vowels || vowels.length < word.length / 4)) return true;

    // Filter out if mostly numbers
    const digitCount = (word.match(/\d/g) || []).length;
    if (digitCount > word.length / 2) return true;

    return false;
  };

  // Count words in body
  const words = bodyText.split(/\s+/).filter(w => w.length > 2);
  words.forEach(word => {
    const normalized = word.toLowerCase().replace(/[^a-zăâîșț0-9]/gi, '');

    // Enhanced filtering: minimum length 4, not in stopWords, not noisy
    if (normalized.length >= 4 &&
        !stopWords.has(normalized) &&
        !isNoisyWord(normalized)) {

      if (!wordFrequency[normalized]) {
        wordFrequency[normalized] = {
          count: 0,
          inTitle: false,
          inH1: false,
          inH2: false,
          inMeta: false,
        };
      }
      wordFrequency[normalized].count++;

      // Check if word appears in important places
      if (titleText.includes(normalized)) wordFrequency[normalized].inTitle = true;
      if (h1Text.includes(normalized)) wordFrequency[normalized].inH1 = true;
      if (h2Text.includes(normalized)) wordFrequency[normalized].inH2 = true;
      if (metaDesc.includes(normalized)) wordFrequency[normalized].inMeta = true;
    }
  });

  // Calculate relevance score for each keyword
  const keywords = Object.entries(wordFrequency)
    .map(([word, data]) => {
      let relevance = data.count;

      // Boost score based on position
      if (data.inTitle) relevance += 50;
      if (data.inH1) relevance += 30;
      if (data.inH2) relevance += 15;
      if (data.inMeta) relevance += 20;

      // Normalize relevance to 0-100 scale
      const normalizedRelevance = Math.min(100, relevance);

      return {
        word,
        count: data.count,
        relevance: normalizedRelevance,
      };
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 15);

  return keywords;
}

export async function analyzeSecurity(
  url: string,
  response: Response,
  html: string,
  $: cheerio.CheerioAPI
): Promise<SecurityAnalysis> {
  const headers = response.headers;
  let score = 0;
  const maxScore = 15;

  // Check HTTPS
  const https = url.startsWith('https://');
  if (https) score += 2;

  // Check HSTS
  const hsts = headers.get('strict-transport-security') !== null;
  const hstsHeader = headers.get('strict-transport-security');
  let hstsMaxAge: number | null = null;

  if (hsts) {
    score += 3;
    const maxAgeMatch = hstsHeader?.match(/max-age=(\d+)/);
    if (maxAgeMatch) {
      hstsMaxAge = parseInt(maxAgeMatch[1]);
      // Check if max-age >= 1 year (31536000 seconds)
      if (hstsMaxAge >= 31536000) score += 2;
    }
  }

  // Security Headers
  const securityHeaders = {
    contentSecurityPolicy: headers.get('content-security-policy') !== null,
    xFrameOptions: headers.get('x-frame-options') !== null,
    xContentTypeOptions: headers.get('x-content-type-options') !== null,
    strictTransportSecurity: hsts,
    xXssProtection: headers.get('x-xss-protection') !== null,
    referrerPolicy: headers.get('referrer-policy') !== null,
    permissionsPolicy: headers.get('permissions-policy') !== null,
  };

  if (securityHeaders.xFrameOptions) score += 1;
  if (securityHeaders.xContentTypeOptions) score += 1;
  if (securityHeaders.xXssProtection) score += 1;
  if (securityHeaders.contentSecurityPolicy) score += 2;
  if (securityHeaders.referrerPolicy) score += 1;
  if (securityHeaders.permissionsPolicy) score += 1;

  // Check for mixed content (HTTP resources on HTTPS page)
  const mixedContent: string[] = [];
  if (https) {
    // Check images
    $('img[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src && src.startsWith('http://')) {
        mixedContent.push(src);
      }
    });

    // Check scripts
    $('script[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src && src.startsWith('http://')) {
        mixedContent.push(src);
      }
    });

    // Check stylesheets
    $('link[rel="stylesheet"][href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('http://')) {
        mixedContent.push(href);
      }
    });

    if (mixedContent.length > 0) score -= 1;
  }

  // SSL Info (simplified - in production, you'd use a library to check cert)
  const sslInfo = {
    valid: https,
    daysUntilExpiry: null as number | null,
  };

  return {
    score: Math.max(0, score),
    maxScore,
    https,
    hsts,
    hstsMaxAge,
    mixedContent: mixedContent.slice(0, 5), // Limit to first 5
    securityHeaders,
    sslInfo,
  };
}

export function analyzeAccessibility($: cheerio.CheerioAPI): AccessibilityAnalysis {
  let score = 0;
  const maxScore = 14;
  const issues: AccessibilityAnalysis['issues'] = [];

  // Check for lang attribute
  const hasLangAttribute = $('html').attr('lang') !== undefined;
  if (hasLangAttribute) score += 2;
  else issues.push({
    type: 'serious',
    message: 'Missing lang attribute on <html> tag',
    count: 1,
  });

  // Check images for alt text
  const images = $('img');
  let imagesWithAlt = 0;
  images.each((_, img) => {
    const alt = $(img).attr('alt');
    if (alt !== undefined) imagesWithAlt++;
  });
  const imagesHaveAlt = images.length === 0 || imagesWithAlt === images.length;
  if (imagesHaveAlt && images.length > 0) score += 3;
  else if (images.length > 0) {
    const missingAlt = images.length - imagesWithAlt;
    issues.push({
      type: 'serious',
      message: `${missingAlt} images missing alt attributes`,
      count: missingAlt,
    });
  }

  // Check links for text
  const links = $('a');
  let linksWithoutText = 0;
  links.each((_, link) => {
    const text = $(link).text().trim();
    const ariaLabel = $(link).attr('aria-label');
    const title = $(link).attr('title');
    if (!text && !ariaLabel && !title) linksWithoutText++;
  });
  const linksHaveText = linksWithoutText === 0;
  if (linksHaveText) score += 2;
  else issues.push({
    type: 'serious',
    message: `${linksWithoutText} links without discernible text`,
    count: linksWithoutText,
  });

  // Check buttons for accessible names
  const buttons = $('button');
  let buttonsWithoutNames = 0;
  buttons.each((_, button) => {
    const text = $(button).text().trim();
    const ariaLabel = $(button).attr('aria-label');
    const ariaLabelledby = $(button).attr('aria-labelledby');
    if (!text && !ariaLabel && !ariaLabelledby) buttonsWithoutNames++;
  });
  const buttonsHaveAccessibleNames = buttonsWithoutNames === 0;
  if (buttonsHaveAccessibleNames) score += 2;
  else issues.push({
    type: 'serious',
    message: `${buttonsWithoutNames} buttons without accessible names`,
    count: buttonsWithoutNames,
  });

  // Check heading hierarchy
  const headings = $('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  let hierarchyCorrect = true;
  headings.each((_, heading) => {
    const tagName = heading.tagName.toLowerCase();
    const currentLevel = parseInt(tagName.substring(1));
    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      hierarchyCorrect = false;
    }
    previousLevel = currentLevel;
  });
  if (hierarchyCorrect) score += 2;
  else issues.push({
    type: 'moderate',
    message: 'Heading elements are not in sequentially-descending order',
    count: 1,
  });

  // Check for ARIA labels
  const elementsWithAria = $('[aria-label], [aria-labelledby], [role]').length;
  const hasAriaLabels = elementsWithAria > 0;
  if (hasAriaLabels) score += 1;

  // Check for form labels
  const inputs = $('input[type="text"], input[type="email"], input[type="tel"], input[type="password"], textarea');
  let inputsWithLabels = 0;
  inputs.each((_, input) => {
    const id = $(input).attr('id');
    const ariaLabel = $(input).attr('aria-label');
    if (id && $(`label[for="${id}"]`).length > 0) inputsWithLabels++;
    else if (ariaLabel) inputsWithLabels++;
  });
  if (inputs.length === 0 || inputsWithLabels === inputs.length) score += 2;
  else issues.push({
    type: 'serious',
    message: `${inputs.length - inputsWithLabels} form inputs without labels`,
    count: inputs.length - inputsWithLabels,
  });

  return {
    score: Math.max(0, score),
    maxScore,
    issues,
    checks: {
      hasAriaLabels,
      hasLangAttribute,
      imagesHaveAlt,
      linksHaveText,
      buttonsHaveAccessibleNames,
    },
  };
}

export function detectPlatform($: cheerio.CheerioAPI, html: string, headers: Headers): PlatformAnalysis {
  let cms: string | null = null;
  let theme: string | null = null;
  const frameworks: string[] = [];
  let server: string | null = headers.get('server');
  let cdn: string | null = null;

  // Detect WordPress
  if (html.includes('wp-content') || html.includes('wp-includes') || $('meta[name="generator"]').attr('content')?.includes('WordPress')) {
    cms = 'WordPress';

    // Try to detect theme
    const themeMatch = html.match(/wp-content\/themes\/([^/'"]+)/);
    if (themeMatch) theme = themeMatch[1];
  }

  // Detect other CMS
  if (html.includes('Shopify') || headers.get('x-shopify-stage')) cms = 'Shopify';
  if (html.includes('Wix.com') || html.includes('_wix')) cms = 'Wix';
  if (html.includes('Webflow')) cms = 'Webflow';
  if (html.includes('Squarespace')) cms = 'Squarespace';

  // Detect frameworks
  if (html.includes('_next') || html.includes('__NEXT_DATA__')) frameworks.push('Next.js');
  if (html.includes('react') || $('[data-reactroot]').length > 0) frameworks.push('React');
  if (html.includes('vue') || $('[data-v-]').length > 0) frameworks.push('Vue.js');
  if (html.includes('ng-version')) frameworks.push('Angular');

  // Detect CDN
  if (headers.get('cf-ray')) cdn = 'Cloudflare';
  if (headers.get('x-amz-cf-id')) cdn = 'AWS CloudFront';
  if (headers.get('x-azure-ref')) cdn = 'Azure CDN';

  return {
    cms,
    theme,
    frameworks,
    server,
    cdn,
  };
}

export async function analyzeAICrawlers(url: string): Promise<AICrawlerAccess> {
  const aiCrawlers = [
    { name: 'GPTBot', userAgent: 'GPTBot', allowed: false, blocked: false },
    { name: 'ChatGPT-User', userAgent: 'ChatGPT-User', allowed: false, blocked: false },
    { name: 'Google-Extended', userAgent: 'Google-Extended', allowed: false, blocked: false },
    { name: 'PerplexityBot', userAgent: 'PerplexityBot', allowed: false, blocked: false },
    { name: 'ClaudeBot', userAgent: 'ClaudeBot', allowed: false, blocked: false },
    { name: 'Claude-Web', userAgent: 'Claude-Web', allowed: false, blocked: false },
    { name: 'anthropic-ai', userAgent: 'anthropic-ai', allowed: false, blocked: false },
    { name: 'Bytespider', userAgent: 'Bytespider', allowed: false, blocked: false },
    { name: 'CCBot', userAgent: 'CCBot', allowed: false, blocked: false },
    { name: 'FacebookBot', userAgent: 'FacebookBot', allowed: false, blocked: false },
    { name: 'Applebot-Extended', userAgent: 'Applebot-Extended', allowed: false, blocked: false },
    { name: 'cohere-ai', userAgent: 'cohere-ai', allowed: false, blocked: false },
  ];

  try {
    const robotsUrl = new URL('/robots.txt', url).href;
    const robotsResponse = await fetch(robotsUrl, { signal: AbortSignal.timeout(5000) });

    if (robotsResponse.ok) {
      const robotsTxt = await robotsResponse.text();

      // Parse robots.txt for each crawler
      aiCrawlers.forEach(crawler => {
        const userAgentRegex = new RegExp(`User-agent:\\s*${crawler.userAgent}`, 'i');
        const disallowRegex = new RegExp(`User-agent:\\s*${crawler.userAgent}[\\s\\S]*?Disallow:\\s*/`, 'i');

        if (userAgentRegex.test(robotsTxt)) {
          if (disallowRegex.test(robotsTxt)) {
            crawler.blocked = true;
          } else {
            crawler.allowed = true;
          }
        } else {
          // Check if * allows it
          const starAllows = /User-agent:\s*\*[\s\S]*?Allow:\s*\//i.test(robotsTxt);
          const starDisallows = /User-agent:\s*\*[\s\S]*?Disallow:\s*\//i.test(robotsTxt);

          if (starAllows && !starDisallows) crawler.allowed = true;
          else if (!starDisallows) crawler.allowed = true; // Default allow
        }
      });
    }
  } catch (error) {
    // robots.txt not accessible, assume allowed
    aiCrawlers.forEach(c => c.allowed = true);
  }

  // Check for llms.txt
  let llmsTxtExists = false;
  try {
    const llmsUrl = new URL('/llms.txt', url).href;
    const llmsResponse = await fetch(llmsUrl, { signal: AbortSignal.timeout(5000) });
    llmsTxtExists = llmsResponse.ok;
  } catch (error) {
    llmsTxtExists = false;
  }

  return {
    robotsTxtExists: true, // Assume exists if we got here
    llmsTxtExists,
    crawlers: aiCrawlers,
  };
}

export function analyzeResources($: cheerio.CheerioAPI, html: string): ResourceBreakdown {
  const scripts = $('script[src]');
  const stylesheets = $('link[rel="stylesheet"]');
  const images = $('img[src]');
  const fonts = $('link[rel="preload"][as="font"], link[href*=".woff"], link[href*=".ttf"]');

  // Detect third-party domains
  const thirdPartyDomains = new Set<string>();

  const checkUrl = (url: string | undefined) => {
    if (!url || url.startsWith('/') || url.startsWith('#')) return;
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      if (!hostname.includes('localhost') && hostname !== '') {
        thirdPartyDomains.add(hostname);
      }
    } catch (e) {
      // Invalid URL
    }
  };

  scripts.each((_, el) => checkUrl($(el).attr('src')));
  stylesheets.each((_, el) => checkUrl($(el).attr('href')));
  images.each((_, el) => checkUrl($(el).attr('src')));

  return {
    totalRequests: scripts.length + stylesheets.length + images.length + fonts.length + 1, // +1 for HTML
    html: 1,
    css: stylesheets.length,
    javascript: scripts.length,
    images: images.length,
    fonts: fonts.length,
    other: 0,
    thirdParty: Array.from(thirdPartyDomains),
  };
}
