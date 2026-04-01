# 🔍 SEO Audit Tool - Advanced Edition

Professional SEO analysis tool with AI optimization features, built with Next.js 16, TypeScript, and Tailwind CSS.

## ✅ Build Status

**BUILD SUCCESSFUL** - All advanced features implemented and working!

## 🚀 Quick Start

### 1. Configure Environment Variables

Edit `.env.local` with your SMTP credentials:

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-password
SMTP_FROM=noreply@yourdomain.com
```

### 2. Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Production Build

```bash
npm run build
npm run start
```

## 📡 API Endpoints

### POST /api/analyze
Analyzes a website URL and returns SEO metrics.

**Request:**
```json
{
  "url": "https://example.com"
}
```

### POST /api/send-report
Sends audit report via email.

### GET /api/health
Health check endpoint - Returns `{"status":"ok","timestamp":"..."}`

## 🎯 Features

### 📊 Category-Based Scoring System (NEW!)
Comprehensive analysis with breakdown across 6 key categories:
- **AI Visibility (GEO)** - Score: 0-6 points
- **On-Page SEO** - Score: 0-25 points
- **Technical** - Score: 0-20 points
- **Security** - Score: 0-15 points
- **Performance** - Score: 0-20 points
- **Accessibility** - Score: 0-14 points
- **Overall Score** - Combined: 0-100 points

### 🤖 GEO - Generative Engine Optimization
Optimize your content for AI engines (ChatGPT, Claude, Perplexity):
- ✅ Structured data scoring (0-100)
- ✅ Content readability analysis for AI processing
- ✅ FAQ content detection and validation
- ✅ Question-answer format identification
- ✅ Step-by-step guide detection
- ✅ List-based content analysis
- ✅ Summary section verification
- ✅ Content length classification (short/medium/long)
- ✅ Personalized GEO recommendations

### 📋 Schema.org Markup Analysis
Complete structured data validation:
- ✅ JSON-LD detection and parsing
- ✅ Multiple schema types: Organization, Breadcrumb, Article, BlogPosting, NewsArticle, FAQ, HowTo, LocalBusiness
- ✅ Schema validation errors
- ✅ Missing schema recommendations
- ✅ Schema type badge display

### 🔍 Advanced SEO Analysis
Deep content and structure analysis:
- ✅ **Images**: Alt text coverage percentage, total/with alt/without alt breakdown
- ✅ **Links**: Internal and external link counting
- ✅ **Heading Structure**: H1-H6 distribution, hierarchy validation
- ✅ **Mobile-Friendly**: Viewport meta, responsive meta, touch icons
- ✅ **Keywords Advanced**: Relevance-based scoring with position weighting (title, H1, H2, meta description boost)
- ✅ **Keyword Density**: Calculation and display

### 🔒 Security Analysis (NEW!)
Comprehensive security audit:
- ✅ HTTPS verification
- ✅ HSTS (HTTP Strict Transport Security) detection
- ✅ HSTS max-age validation (≥ 1 year recommended)
- ✅ Mixed content detection (HTTP resources on HTTPS pages)
- ✅ Security headers analysis:
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security
  - X-XSS-Protection
  - Referrer-Policy
  - Permissions-Policy
- ✅ SSL certificate validation
- ✅ Security score (0-15 points)

### ♿ Accessibility Analysis (NEW!)
WCAG compliance checks:
- ✅ **Lang attribute** on HTML tag
- ✅ **Images**: Alt text validation for all images
- ✅ **Links**: Discernible text/aria-label validation
- ✅ **Buttons**: Accessible names validation
- ✅ **Form inputs**: Label association checking
- ✅ **Heading hierarchy**: Sequential order validation
- ✅ **ARIA labels**: Presence detection
- ✅ Detailed issue reporting (critical/serious/moderate/minor)
- ✅ Accessibility score (0-14 points)

### 🖥️ Platform Detection (NEW!)
Automatic technology stack identification:
- ✅ **CMS Detection**: WordPress, Shopify, Wix, Webflow, Squarespace
- ✅ **Theme Detection**: WordPress theme identification
- ✅ **Framework Detection**: Next.js, React, Vue.js, Angular
- ✅ **Server Detection**: From server headers
- ✅ **CDN Detection**: Cloudflare, AWS CloudFront, Azure CDN

### 🤖 AI Crawler Access Analysis (NEW!)
robots.txt and AI crawler permissions:
- ✅ **robots.txt** existence check
- ✅ **llms.txt** detection (AI-specific)
- ✅ **AI Crawler Status** for 12 major crawlers:
  - GPTBot (OpenAI ChatGPT)
  - ChatGPT-User
  - Google-Extended (Google Gemini)
  - PerplexityBot (Perplexity AI)
  - ClaudeBot (Anthropic Claude)
  - Claude-Web
  - anthropic-ai
  - Bytespider (ByteDance)
  - CCBot (Common Crawl)
  - FacebookBot (Meta AI)
  - Applebot-Extended (Apple Siri)
  - cohere-ai (Cohere AI)
- ✅ Allowed/Blocked/Not specified status for each

### 📦 Resource Breakdown (NEW!)
Complete resource analysis:
- ✅ Total HTTP requests counting
- ✅ Resource type breakdown:
  - HTML pages
  - JavaScript files
  - CSS stylesheets
  - Images
  - Fonts
  - Other resources
- ✅ Third-party domain detection
- ✅ External resource listing

### Core SEO Analysis
Standard SEO metrics:
- ✅ Complete SEO Analysis (meta tags, headers, Core Web Vitals)
- ✅ Real-time analysis with loading progress
- ✅ Interactive dashboard with stats visualization
- ✅ Core Web Vitals gauges (LCP, FID, CLS, FCP, TTFB)
- ✅ Social preview cards (Open Graph & Twitter)
- ✅ SEO audit checklist

### 📧 Enhanced Email Reports
Professional HTML email templates:
- ✅ Modern design (blue gradient, professional layout)
- ✅ Category-based score breakdown
- ✅ GEO section with scores and features
- ✅ Schema markup section with detected types
- ✅ SEO Advanced section (images, links, headings)
- ✅ Security section with headers analysis
- ✅ Accessibility section with issue breakdown
- ✅ Platform detection display
- ✅ AI Crawler access status
- ✅ Resource breakdown
- ✅ 💡 Prioritized recommendations (top 10)
- ✅ ⚠️ Critical issues highlighting
- ✅ Actionable improvement hooks

### Design & UX
- ✅ Professional blue/gray color scheme (alexTag.dev inspired)
- ✅ No AI-typical purple/pink gradients
- ✅ Clean, modern, business-oriented design
- ✅ Email capture for premium content
- ✅ Mock data fallback for demo mode
- ✅ Dark mode support
- ✅ Fully responsive design
- ✅ Custom animations

## 🛠️ Tech Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4
- shadcn/ui + Radix UI
- React Query
- Recharts
- Nodemailer
- Cheerio

## 🎨 Design Update

The application now features a professional design inspired by modern SaaS tools:
- **Color Palette**: Professional blue (#3b82f6) and gray tones
- **No More AI-Look**: Removed typical purple/pink gradients
- **Clean & Modern**: Focused on clarity and professionalism
- **Enhanced Email Templates**: Blue gradient headers, structured sections, clear CTAs

## 📊 Complete Analysis Breakdown

### 🎯 AI Visibility (GEO) - 6 points
**What we check:**
- Structured data score (0-100)
- Content readability score (0-100)
- FAQ content presence
- Question-answer format
- Step-by-step guides
- List-based content
- Summary sections
- Content length (short/medium/long)

**Why it matters:** Optimizes your content for AI search engines and chatbots (ChatGPT, Claude, Perplexity), ensuring better visibility in AI-generated responses.

### 📄 On-Page SEO - 25 points
**What we check:**
- Meta title length (30-60 chars = 5 pts)
- Meta description length (120-160 chars = 5 pts)
- Viewport meta tag (5 pts)
- Canonical URL (5 pts)
- Schema markup presence (5 pts)
- H1 tag (exactly 1 = optimal)
- Keywords in title, headings, description

**Why it matters:** Foundation of SEO - these elements directly influence your search engine rankings.

### ⚙️ Technical - 20 points
**What we check:**
- HTTPS enabled (4 pts)
- Viewport meta (4 pts)
- Canonical URL (4 pts)
- Gzip compression (4 pts)
- Heading hierarchy correct (4 pts)
- Robots.txt existence
- XML sitemap
- Cache headers

**Why it matters:** Technical SEO ensures search engines can properly crawl and index your site.

### 🔒 Security - 15 points
**What we check:**
- HTTPS enabled (2 pts)
- HSTS header (3 pts)
- HSTS max-age ≥ 1 year (2 pts)
- X-Frame-Options (1 pt)
- X-Content-Type-Options (1 pt)
- X-XSS-Protection (1 pt)
- Content-Security-Policy (2 pts)
- Referrer-Policy (1 pt)
- Permissions-Policy (1 pt)
- Mixed content detection

**Why it matters:** Security directly affects user trust and search engine rankings. Sites without HTTPS are penalized.

### ⚡ Performance - 20 points
**What we check:**
- TTFB < 200ms (5 pts), < 500ms (3 pts)
- Load time < 2s (5 pts), < 4s (3 pts)
- LCP < 2.5s (5 pts), < 4s (3 pts)
- FCP < 1.8s (5 pts), < 3s (3 pts)
- Page size
- Resource optimization

**Why it matters:** Core Web Vitals are ranking factors. Faster sites have better user experience and higher rankings.

### ♿ Accessibility - 14 points
**What we check:**
- Lang attribute on HTML (2 pts)
- Images with alt text (3 pts)
- Links with discernible text (2 pts)
- Buttons with accessible names (2 pts)
- Form inputs with labels (2 pts)
- Heading hierarchy (2 pts)
- ARIA labels presence (1 pt)

**Why it matters:** Accessibility is required by law in many countries and improves UX for all users. Also affects SEO.

### Additional Analysis

**🔍 Schema.org Markup:**
- JSON-LD detection
- Organization, Breadcrumb, Article, FAQ, HowTo, LocalBusiness
- Schema validation errors
- Missing schema recommendations

**🖥️ Platform Detection:**
- CMS (WordPress, Shopify, Wix, etc.)
- Theme identification
- Framework detection (Next.js, React, Vue, Angular)
- Server software
- CDN provider

**🤖 AI Crawler Access:**
- robots.txt analysis
- llms.txt detection
- 12 AI crawler permissions (GPTBot, ClaudeBot, PerplexityBot, etc.)
- Allowed/Blocked status for each

**📦 Resource Breakdown:**
- Total HTTP requests
- JS, CSS, Images, Fonts counting
- Third-party domains
- Resource optimization opportunities

**🔑 Advanced Keywords:**
- Relevance-based scoring
- Position weighting (title, H1, H2, meta boost)
- Frequency analysis
- Keyword density calculation

## 🐛 Fixes Applied

All build issues have been resolved:
- ✅ Added 'use client' directives to client components
- ✅ Fixed Tailwind CSS v4 compatibility
- ✅ Updated component type definitions
- ✅ Fixed workspace root warning
- ✅ Extended audit types with GEO, Schema, and Advanced SEO
- ✅ Updated email templates with comprehensive reporting

## 📝 Testing

### API Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Analyze URL
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

## 🎉 Success!

The Next.js migration is complete and fully functional! All features from the original Vite+Express app have been successfully ported.
