import { Lead } from '../types';

export function downloadAsJSON(leads: Lead[], filename = 'leads'): void {
  const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' });
  trigger(blob, `${filename}.json`);
}

export function downloadAsCSV(leads: Lead[], filename = 'leads'): void {
  const headers = ['Name','Category','Address','City','Phone','Website','Score','Priority','Maturity','Gaps','Service','Value','Google Search','Google Maps'];
  const rows = leads.map((l) => [
    l.name, l.category, l.address, l.location.city,
    l.contact.phone ?? '', l.contact.website ?? '',
    l.score.value, l.score.priority, l.maturity,
    l.gaps.map((g) => g.label).join(' | '),
    l.recommendation.service, l.recommendation.potentialValue,
    l.contact.smartLinks.googleSearchUrl, l.contact.smartLinks.googleMapsUrl,
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  trigger(new Blob([csv], { type: 'text/csv' }), `${filename}.csv`);
}

function trigger(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}