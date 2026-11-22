function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function valueOrDash(value?: string | null): string {
  return value && value.trim() ? value.trim() : "Not specified";
}

function renderRows(rows: [string, string | undefined][]): string {
  return rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid rgba(191,160,84,.18);color:#bfa054;font-size:12px;text-transform:uppercase;letter-spacing:.08em;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid rgba(191,160,84,.18);color:#ededed;font-size:14px;white-space:pre-wrap;vertical-align:top">${escapeHtml(valueOrDash(value))}</td>
        </tr>`,
    )
    .join("");
}

function renderDocument(title: string, subtitle: string, rows: [string, string | undefined][]): string {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f1e8;font-family:Inter,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;overflow:hidden;border:1px solid rgba(191,160,84,.35);border-radius:18px;background:#0d0d0d;color:#ededed">
    <div style="padding:28px 28px 22px;border-bottom:1px solid rgba(191,160,84,.25)">
      <p style="margin:0;color:#bfa054;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase">SMA Real Estate &amp; Builders</p>
      <h1 style="margin:10px 0 6px;font-size:22px;line-height:1.3;color:#ededed">${escapeHtml(title)}</h1>
      <p style="margin:0;color:#d8cdb6;font-size:13px">${escapeHtml(subtitle)}</p>
    </div>
    <table style="width:100%;border-collapse:collapse">${renderRows(rows)}</table>
    <div style="padding:18px 28px 28px;color:#d8cdb6;font-size:12px;line-height:1.6">
      Please contact the customer directly using the details above. Reply to this email if you need help.
    </div>
  </div></body></html>`;
}

export interface EnquiryEmailInput {
  name: string;
  phone: string;
  email: string;
  interestedProperty: string;
  propertyLocation: string;
  message?: string;
  source: string;
  submittedAt: string;
}

export function enquiryAdminEmail(input: EnquiryEmailInput): { subject: string; text: string; html: string } {
  const subject = `New enquiry — ${valueOrDash(input.interestedProperty)}`;
  const text = [
    "New website enquiry",
    `Customer name: ${valueOrDash(input.name)}`,
    `Mobile: ${valueOrDash(input.phone)}`,
    `Email: ${valueOrDash(input.email)}`,
    `Interested property: ${valueOrDash(input.interestedProperty)}`,
    `Property location: ${valueOrDash(input.propertyLocation)}`,
    `Enquiry message: ${valueOrDash(input.message)}`,
    `Source: ${valueOrDash(input.source)}`,
    `Received: ${valueOrDash(input.submittedAt)}`,
  ].join("\n");
  const html = renderDocument("New website enquiry", "A customer submitted an enquiry on the SMA website.", [
    ["Customer name", input.name],
    ["Mobile", input.phone],
    ["Email", input.email],
    ["Interested property", input.interestedProperty],
    ["Property location", input.propertyLocation],
    ["Enquiry message", input.message],
    ["Source", input.source],
    ["Received", input.submittedAt],
  ]);
  return { subject, text, html };
}

export interface SiteVisitEmailInput {
  customerName: string;
  phone: string;
  email: string;
  interestedProperty: string;
  propertyLocation: string;
  preferredDate: string;
  preferredTime: string;
  contactPreference: string;
  notes?: string;
  submittedAt: string;
}

export function siteVisitAdminEmail(input: SiteVisitEmailInput): { subject: string; text: string; html: string } {
  const subject = `New site visit — ${valueOrDash(input.interestedProperty)}`;
  const text = [
    "New site visit request",
    `Customer name: ${valueOrDash(input.customerName)}`,
    `Mobile: ${valueOrDash(input.phone)}`,
    `Email: ${valueOrDash(input.email)}`,
    `Interested property: ${valueOrDash(input.interestedProperty)}`,
    `Property location: ${valueOrDash(input.propertyLocation)}`,
    `Preferred date: ${valueOrDash(input.preferredDate)}`,
    `Preferred time: ${valueOrDash(input.preferredTime)}`,
    `Preferred contact: ${valueOrDash(input.contactPreference)}`,
    `Notes: ${valueOrDash(input.notes)}`,
    `Received: ${valueOrDash(input.submittedAt)}`,
  ].join("\n");
  const html = renderDocument("New site visit request", "A customer requested a site visit on the SMA website.", [
    ["Customer name", input.customerName],
    ["Mobile", input.phone],
    ["Email", input.email],
    ["Interested property", input.interestedProperty],
    ["Property location", input.propertyLocation],
    ["Preferred date", input.preferredDate],
    ["Preferred time", input.preferredTime],
    ["Preferred contact", input.contactPreference],
    ["Notes", input.notes],
    ["Received", input.submittedAt],
  ]);
  return { subject, text, html };
}
