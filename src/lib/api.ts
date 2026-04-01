export type { AuditResult, SendReportRequest, CoreWebVitals, SocialMeta } from './types/audit';
import type { AuditResult, SendReportRequest } from './types/audit';

const API_BASE_URL = '/api'; // Relative for Next.js

export async function analyzeUrl(url: string): Promise<AuditResult> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Eroare la analiza URL-ului');
  }

  return response.json();
}

export async function sendReport(data: SendReportRequest): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/send-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Eroare la trimiterea raportului');
  }

  return response.json();
}
