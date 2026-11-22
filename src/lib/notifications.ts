/**
 * Notification layer — email and WhatsApp.
 *
 * Designed to be dependency-free and to degrade gracefully: when the relevant
 * environment variables are absent, the channel is skipped and the message is
 * logged to the server console (useful in development). Sends never throw — a
 * failed notification must never break a user-facing request.
 *
 * Email  → Resend REST API          (RESEND_API_KEY, EMAIL_FROM)
 * WhatsApp → Meta Graph API          (WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID)
 */

import { businessConfig } from "./business-config";

export type NotificationChannel = "email" | "whatsapp";

const BRAND = "SMA Real Estate & Builders";

export interface NotifyInput {
  email?: string | null;
  phone?: string | null;
  subject: string;
  text: string;
  html?: string;
  whatsapp?: string;
  /** Also deliver a copy to the admin inbox, if configured. */
  notifyAdmin?: boolean;
  adminSubject?: string;
  adminText?: string;
  adminHtml?: string;
}

export interface NotifyResult {
  email: "sent" | "skipped" | "failed";
  whatsapp: "sent" | "skipped" | "failed";
  admin: "sent" | "skipped" | "failed";
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export function isWhatsAppConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

function normalizePhone(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

/** Renders a simple, on-brand HTML email from plain text. Pure and testable. */
export function renderEmailHtml(subject: string, text: string): string {
  const body = text
    .split("\n")
    .map((line) => (line.trim() ? `<p style="margin:0 0 12px">${escapeHtml(line)}</p>` : ""))
    .join("");
  return `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;background:#f5f1e8;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#0d0d0d;border-radius:16px;padding:32px;color:#ededed">
      <h1 style="font-size:20px;margin:0 0 20px;color:#bfa054">${escapeHtml(subject)}</h1>
    ${body}
    <p style="margin-top:24px;color:#d8cdb6;font-size:12px">${escapeHtml(BRAND)} — Tamil Nadu's real estate company</p>
  </div></body></html>`;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
  if (!isEmailConfigured()) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html: html ?? renderEmailHtml(subject, text),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendWhatsApp(to: string, text: string): Promise<boolean> {
  if (!isWhatsAppConfigured()) return false;
  try {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: text },
        }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Dispatch a notification across all configured channels. Never throws.
 */
export async function notify(input: NotifyInput): Promise<NotifyResult> {
  const result: NotifyResult = { email: "skipped", whatsapp: "skipped", admin: "skipped" };

  if (input.email) {
    if (isEmailConfigured()) {
      result.email = (await sendEmail(input.email, input.subject, input.text, input.html)) ? "sent" : "failed";
    } else {
      console.info(`[notify:email:skipped] to=${input.email} subject="${input.subject}"`);
    }
  }

  const wa = normalizePhone(input.phone);
  if (wa && input.whatsapp) {
    if (isWhatsAppConfigured()) {
      result.whatsapp = (await sendWhatsApp(wa, input.whatsapp)) ? "sent" : "failed";
    } else {
      console.info(`[notify:whatsapp:skipped] to=${wa}`);
    }
  }

  const adminEmail =
    process.env.ADMIN_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || businessConfig.businessEmail;
  if (input.notifyAdmin && adminEmail) {
    const subject = input.adminSubject ?? `[Lead] ${input.subject}`;
    const text = input.adminText ?? input.text;
    if (isEmailConfigured()) {
      result.admin = (await sendEmail(adminEmail, subject, text, input.adminHtml)) ? "sent" : "failed";
    } else {
      console.info(`[notify:admin:skipped] to=${adminEmail} subject="${subject}"`);
    }
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/*  Message builders (pure — unit tested)                                      */
/* -------------------------------------------------------------------------- */

export function leadAckMessage(name: string, summary?: string): { subject: string; text: string } {
  return {
    subject: "We've received your enquiry",
    text: [
      `Hi ${name.split(" ")[0]},`,
      `Thank you for reaching out to ${BRAND}. One of our property specialists will contact you shortly.`,
      summary ? `\nYour enquiry:\n${summary}` : "",
      "\nIn the meantime, explore verified listings across Tamil Nadu on our website.",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

export function siteVisitAckMessage(name: string, propertyTitle?: string, date?: string, time?: string): { subject: string; text: string } {
  return {
    subject: "Your site visit request is confirmed",
    text: [
      `Hi ${name.split(" ")[0]},`,
      "We've received your site visit request and will confirm the slot shortly.",
      propertyTitle ? `Property: ${propertyTitle}` : "",
      date ? `Preferred date: ${date}${time ? ` at ${time}` : ""}` : "",
      "\nIf you need to reschedule, just reply to this message.",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

export function sellAckMessage(name: string, summary: string): { subject: string; text: string } {
  return {
    subject: "Your property listing request",
    text: [
      `Hi ${name.split(" ")[0]},`,
      `Thank you for choosing ${BRAND} to list your property. A listing specialist will call you within one business day to verify your documents.`,
      `\nYour request:\n${summary}`,
    ].join("\n"),
  };
}
