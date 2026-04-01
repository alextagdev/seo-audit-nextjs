import nodemailer from 'nodemailer';
import type { AuditResult } from '@/lib/types/audit';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const statusBadge = (status: 'ok' | 'fix' | 'warning') => {
  const colors = {
    ok: { bg: '#22c55e', text: '#ffffff' },
    fix: { bg: '#ef4444', text: '#ffffff' },
    warning: { bg: '#f59e0b', text: '#ffffff' },
  };
  const labels = { ok: 'OK', fix: 'FIX', warning: '⚠' };
  const c = colors[status] || colors.warning;
  return `<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;background:${c.bg};color:${c.text};">${labels[status]}</span>`;
};

const scoreBar = (score: number, max: number = 100) => {
  const percentage = (score / max) * 100;
  const color = percentage >= 70 ? '#22c55e' : percentage >= 40 ? '#f59e0b' : '#ef4444';
  return `
    <div style="background:#e5e7eb;border-radius:4px;height:6px;overflow:hidden;margin-top:4px;">
      <div style="background:${color};height:100%;width:${percentage}%;"></div>
    </div>
  `;
};

export async function sendAuditReport(email: string, auditData: AuditResult) {
  const htmlEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raport SEO</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;color:#1e293b;font-size:13px;">
  <div style="max-width:700px;margin:0 auto;padding:20px 16px;">

    <!-- Compact Header -->
    <div style="text-align:center;margin-bottom:20px;">
      <div style="display:inline-block;width:40px;height:40px;background:linear-gradient(135deg,#3b82f6,#60a5fa);border-radius:8px;line-height:40px;color:white;font-weight:bold;font-size:18px;">S</div>
      <h1 style="margin:12px 0 4px;color:#0f172a;font-size:20px;font-weight:700;">Raport SEO</h1>
      <p style="color:#64748b;margin:0;font-size:12px;">pentru <strong style="color:#3b82f6;">${auditData.url}</strong></p>
    </div>

    <!-- Compact Score -->
    <div style="background:linear-gradient(135deg,#3b82f6,#60a5fa);border-radius:12px;padding:20px;text-align:center;color:white;margin-bottom:16px;">
      <p style="margin:0 0 6px;opacity:0.9;font-size:11px;font-weight:600;letter-spacing:0.5px;">SCOR GLOBAL</p>
      <p style="margin:0;font-size:48px;font-weight:800;line-height:1;">${auditData.score}</p>
      <p style="margin:6px 0 0;opacity:0.9;font-size:12px;">din 100 puncte</p>
    </div>

    <!-- Stats Grid 2x2 Compact - Using Table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td width="49%" style="background:white;border-radius:8px;padding:12px;border:1px solid #e2e8f0;">
          <p style="margin:0;color:#64748b;font-size:10px;text-transform:uppercase;">TTFB</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0f172a;">${auditData.speed.ttfb}ms</p>
        </td>
        <td width="2%"></td>
        <td width="49%" style="background:white;border-radius:8px;padding:12px;border:1px solid #e2e8f0;">
          <p style="margin:0;color:#64748b;font-size:10px;text-transform:uppercase;">ÎNCĂRCARE</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0f172a;">${auditData.speed.loadTime}s</p>
        </td>
      </tr>
      <tr><td colspan="3" height="10"></td></tr>
      <tr>
        <td width="49%" style="background:white;border-radius:8px;padding:12px;border:1px solid #e2e8f0;">
          <p style="margin:0;color:#64748b;font-size:10px;text-transform:uppercase;">CUVINTE</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0f172a;">${auditData.content.wordCount}</p>
        </td>
        <td width="2%"></td>
        <td width="49%" style="background:white;border-radius:8px;padding:12px;border:1px solid #e2e8f0;">
          <p style="margin:0;color:#64748b;font-size:10px;text-transform:uppercase;">ERORI</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:${auditData.errors.length > 0 ? '#ef4444' : '#22c55e'};">${auditData.errors.length}</p>
        </td>
      </tr>
    </table>

    <!-- 2 Column Layout: GEO + Schema - Using Table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <!-- GEO Compact -->
        <td width="49%" valign="top" style="background:white;border-radius:8px;padding:14px;border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 10px;font-size:14px;color:#0f172a;font-weight:700;">🤖 GEO</h3>
          <div style="margin-bottom:10px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:11px;color:#475569;">Structured Data</td>
                <td align="right" style="font-size:11px;color:#3b82f6;font-weight:600;">${auditData.geo.structuredDataScore}/100</td>
              </tr>
            </table>
            ${scoreBar(auditData.geo.structuredDataScore)}
          </div>
          <div style="margin-bottom:10px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:11px;color:#475569;">Lizibilitate</td>
                <td align="right" style="font-size:11px;color:#3b82f6;font-weight:600;">${auditData.geo.readabilityScore}/100</td>
              </tr>
            </table>
            ${scoreBar(auditData.geo.readabilityScore)}
          </div>
          <div style="background:#f8fafc;border-radius:6px;padding:8px;font-size:10px;color:#475569;">
            ${auditData.geo.hasFAQContent ? '✓' : '✗'} FAQ •
            ${auditData.geo.hasQuestionAnswerFormat ? '✓' : '✗'} Q&A •
            ${auditData.geo.hasStepByStepContent ? '✓' : '✗'} Ghid •
            ${auditData.geo.hasListContent ? '✓' : '✗'} Liste
          </div>
        </td>
        <td width="2%"></td>
        <!-- Schema Compact -->
        <td width="49%" valign="top" style="background:white;border-radius:8px;padding:14px;border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 10px;font-size:14px;color:#0f172a;font-weight:700;">📋 Schema</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:6px;">
            <tr>
              <td style="font-size:11px;">JSON-LD</td>
              <td align="right">${statusBadge(auditData.schema.hasJsonLd ? 'ok' : 'fix')}</td>
            </tr>
          </table>
          ${auditData.schema.schemaTypes.length > 0 ? `
          <div style="margin-bottom:8px;">
            ${auditData.schema.schemaTypes.map(type => `<span style="display:inline-block;padding:2px 6px;background:#dbeafe;color:#1e40af;border-radius:4px;font-size:9px;font-weight:500;margin:2px;">${type}</span>`).join('')}
          </div>
          ` : ''}
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:10px;">
            <tr>
              <td width="49%" style="padding:6px;background:#f8fafc;border-radius:4px;">${auditData.schema.hasOrganization ? '✓' : '✗'} Organization</td>
              <td width="2%"></td>
              <td width="49%" style="padding:6px;background:#f8fafc;border-radius:4px;">${auditData.schema.hasBreadcrumb ? '✓' : '✗'} Breadcrumb</td>
            </tr>
            <tr><td colspan="3" height="4"></td></tr>
            <tr>
              <td width="49%" style="padding:6px;background:#f8fafc;border-radius:4px;">${auditData.schema.hasArticle ? '✓' : '✗'} Article</td>
              <td width="2%"></td>
              <td width="49%" style="padding:6px;background:#f8fafc;border-radius:4px;">${auditData.schema.hasFAQ ? '✓' : '✗'} FAQ</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- 2 Column: SEO Advanced + SEO On-Page - Using Table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td width="49%" valign="top" style="background:white;border-radius:8px;padding:14px;border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 10px;font-size:14px;color:#0f172a;font-weight:700;">🔍 SEO Avansat</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:11px;">
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:6px 0;">Imagini Alt</td>
              <td align="right" style="padding:6px 0;color:#3b82f6;font-weight:600;">${auditData.seoAdvanced.images.withAlt}/${auditData.seoAdvanced.images.total}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:6px 0;">Link Interne</td>
              <td align="right" style="padding:6px 0;color:#3b82f6;font-weight:600;">${auditData.seoAdvanced.links.internal}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:6px 0;">Link Externe</td>
              <td align="right" style="padding:6px 0;color:#3b82f6;font-weight:600;">${auditData.seoAdvanced.links.external}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;">Heading-uri</td>
              <td align="right" style="padding:6px 0;">${statusBadge(auditData.seoAdvanced.headingStructure.isHierarchyCorrect ? 'ok' : 'fix')}</td>
            </tr>
          </table>
        </td>
        <td width="2%"></td>
        <td width="49%" valign="top" style="background:white;border-radius:8px;padding:14px;border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 10px;font-size:14px;color:#0f172a;font-weight:700;">📄 SEO On-Page</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:11px;">
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:6px 0;">Titlu (${auditData.seo.titleLength}ch)</td>
              <td align="right" style="padding:6px 0;">${statusBadge(auditData.seo.titleLength >= 30 && auditData.seo.titleLength <= 60 ? 'ok' : 'warning')}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:6px 0;">Description (${auditData.seo.descriptionLength}ch)</td>
              <td align="right" style="padding:6px 0;">${statusBadge(auditData.seo.descriptionLength >= 120 && auditData.seo.descriptionLength <= 160 ? 'ok' : 'warning')}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:6px 0;">Tag H1</td>
              <td align="right" style="padding:6px 0;">${statusBadge(auditData.content.h1Count === 1 ? 'ok' : 'fix')}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:6px 0;">Canonical</td>
              <td align="right" style="padding:6px 0;">${statusBadge(auditData.seo.hasCanonical ? 'ok' : 'fix')}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;">Viewport</td>
              <td align="right" style="padding:6px 0;">${statusBadge(auditData.seo.hasViewport ? 'ok' : 'fix')}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Technical Compact - Using Table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:white;border-radius:8px;padding:14px;border:1px solid #e2e8f0;margin-bottom:16px;">
      <tr>
        <td colspan="7">
          <h3 style="margin:0 0 10px;font-size:14px;color:#0f172a;font-weight:700;">⚙️ Tehnic</h3>
        </td>
      </tr>
      <tr style="font-size:11px;text-align:center;">
        <td width="23%">
          <span style="color:#475569;display:block;margin-bottom:4px;">HTTPS</span>
          ${statusBadge(auditData.technical.https ? 'ok' : 'fix')}
        </td>
        <td width="2%"></td>
        <td width="23%">
          <span style="color:#475569;display:block;margin-bottom:4px;">Gzip</span>
          ${statusBadge(auditData.technical.gzip ? 'ok' : 'fix')}
        </td>
        <td width="2%"></td>
        <td width="23%">
          <span style="color:#475569;display:block;margin-bottom:4px;">Cache</span>
          ${statusBadge(auditData.technical.cacheHeaders ? 'ok' : 'warning')}
        </td>
        <td width="2%"></td>
        <td width="23%">
          <span style="color:#475569;display:block;margin-bottom:4px;">WebP</span>
          ${statusBadge(auditData.seo.hasWebP ? 'ok' : 'fix')}
        </td>
      </tr>
    </table>

    <!-- Keywords Compact - Using Table -->
    ${auditData.content.keywords.length > 0 ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border-radius:10px;padding:16px;margin-bottom:16px;border:1px solid #3b82f6;">
      <tr>
        <td colspan="5" style="text-align:center;padding-bottom:10px;">
          <h3 style="margin:0;font-size:14px;color:#0f172a;font-weight:700;">🔑 Cuvinte Cheie Top</h3>
        </td>
      </tr>
      ${auditData.content.keywords.slice(0, 9).reduce((rows, kw, index) => {
        if (index % 3 === 0) {
          const kw1 = auditData.content.keywords[index];
          const kw2 = auditData.content.keywords[index + 1];
          const kw3 = auditData.content.keywords[index + 2];
          const getStyle = (i) => {
            const isTop = i < 3;
            return `padding:6px 10px;font-size:${isTop ? '12px' : '11px'};background:${isTop ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : i < 6 ? '#dbeafe' : '#f1f5f9'};color:${isTop ? 'white' : i < 6 ? '#1e40af' : '#475569'};font-weight:${isTop ? '700' : '500'};border-radius:6px;text-align:center;`;
          };
          rows += `<tr>
            <td width="32%" style="${getStyle(index)}">${kw1}</td>
            <td width="2%"></td>
            ${kw2 ? `<td width="32%" style="${getStyle(index + 1)}">${kw2}</td>` : '<td width="32%"></td>'}
            <td width="2%"></td>
            ${kw3 ? `<td width="32%" style="${getStyle(index + 2)}">${kw3}</td>` : '<td width="32%"></td>'}
          </tr>${index + 3 < 9 ? '<tr><td colspan="5" height="6"></td></tr>' : ''}`;
        }
        return rows;
      }, '')}
    </table>
    ` : ''}

    <!-- Recommendations Compact -->
    ${auditData.recommendations.length > 0 ? `
    <div style="background:#dbeafe;border-radius:10px;padding:16px;margin-bottom:16px;border:1px solid #3b82f6;">
      <h3 style="margin:0 0 8px;font-size:14px;color:#1e3a8a;font-weight:700;">💡 Recomandări</h3>
      <ul style="margin:0;padding-left:16px;color:#1e40af;font-size:11px;line-height:1.6;">
        ${auditData.recommendations.slice(0, 6).map(rec => `<li style="margin:6px 0;">${rec}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <!-- CTA Compact -->
    <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);border-radius:10px;padding:20px;margin-bottom:16px;text-align:center;">
      <h3 style="margin:0 0 8px;font-size:18px;color:white;font-weight:800;">Vrei să îmbunătățești site-ul?</h3>
      <p style="margin:0 0 16px;font-size:12px;color:#bfdbfe;">Am găsit <strong style="color:white;">${auditData.errors.length + Math.min(auditData.recommendations.length, 6)} oportunități</strong> de îmbunătățire!</p>
      <div style="margin-bottom:12px;">
        <a href="https://alextag.dev/contact" style="display:inline-block;background:white;color:#1e40af;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;margin:4px;">
          📧 Contactează-mă
        </a>
        <a href="https://wa.me/40728390955?text=Salut!%20Am%20primit%20raportul%20SEO%20pentru%20${encodeURIComponent(auditData.url)}" style="display:inline-block;background:#25D366;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;margin:4px;">
          💬 WhatsApp
        </a>
      </div>
      <p style="margin:0;font-size:11px;color:#e0f2fe;">✅ Consultație 15 min • ✅ Plan personalizat • ✅ Rezultate 30-60 zile</p>
    </div>

    <!-- Social Proof Compact - Using Table -->
    <table width="100%" cellpadding="12" cellspacing="0" style="background:#f8fafc;border-radius:8px;margin-bottom:16px;border:1px solid #e2e8f0;">
      <tr>
        <td colspan="5" style="text-align:center;padding-bottom:8px;">
          <p style="margin:0;font-size:11px;color:#64748b;font-weight:600;">DE CE SĂ LUCREZI CU MINE?</p>
        </td>
      </tr>
      <tr style="text-align:center;">
        <td width="32%">
          <a href="https://g.page/r/CUGgg17umG4XEBM/" target="_blank" style="text-decoration:none;display:block;">
            <p style="margin:0 0 4px;font-size:24px;">⭐</p>
            <p style="margin:0;font-size:18px;font-weight:800;color:#3b82f6;">5.0</p>
            <p style="margin:2px 0;font-size:10px;color:#64748b;">Rating</p>
            <p style="margin:4px 0 0;font-size:9px;color:#3b82f6;font-weight:600;">Vezi →</p>
          </a>
        </td>
        <td width="2%"></td>
        <td width="32%">
          <p style="margin:0 0 4px;font-size:24px;">👥</p>
          <p style="margin:0;font-size:18px;font-weight:800;color:#3b82f6;">25+</p>
          <p style="margin:2px 0 0;font-size:10px;color:#64748b;">Recenzii</p>
        </td>
        <td width="2%"></td>
        <td width="32%">
          <p style="margin:0 0 4px;font-size:24px;">🚀</p>
          <p style="margin:0;font-size:18px;font-weight:800;color:#3b82f6;">10+</p>
          <p style="margin:2px 0 0;font-size:10px;color:#64748b;">Ani Exp</p>
        </td>
      </tr>
    </table>

    <!-- Errors Compact -->
    ${auditData.errors.length > 0 ? `
    <div style="background:#fef2f2;border:1px solid #ef4444;border-radius:8px;padding:12px;margin-bottom:16px;">
      <h3 style="margin:0 0 6px;font-size:13px;color:#991b1b;font-weight:700;">⚠️ Probleme Critice</h3>
      <ul style="margin:0;padding-left:16px;color:#991b1b;font-size:11px;line-height:1.5;">
        ${auditData.errors.map(err => `<li style="margin:4px 0;">${err}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <!-- Footer Compact -->
    <div style="text-align:center;padding-top:16px;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#64748b;font-size:11px;">Generat de <strong style="color:#3b82f6;">SEO Audit Tool</strong></p>
      <p style="margin:6px 0 0;color:#94a3b8;font-size:10px;">© ${new Date().getFullYear()} - Toate drepturile rezervate</p>
    </div>

  </div>
</body>
</html>
  `;

  // Send email
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@yourdomain.com',
    to: email,
    subject: `🔍 Raport SEO - ${auditData.url}`,
    html: htmlEmail,
  });

  console.log(`Report sent to ${email}`);
}
