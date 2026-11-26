"use client";

import { useRef, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/providers/app-providers";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { getGa4PageContext, safeWhatsappUrl, trackGa4Event } from "@/lib/ga4";
import { isValidMobile } from "@/lib/validation";
import { siteVisitWhatsappMessage } from "@/lib/business-config";
import { openWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface Props {
  propertyTitle: string;
  analyticsLocation?: string;
  triggerLabel?: React.ReactNode;
  triggerVariant?: "primary" | "secondary" | "ghost" | "light" | "outline" | "danger";
  triggerSize?: "sm" | "md" | "lg" | "icon";
  triggerClassName?: string;
}

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function initialForm() {
  return {
    customerName: "",
    phone: "",
    email: "",
    preferredDate: todayPlus(2),
    preferredTime: "11:00",
    notes: "",
  };
}

export function SiteVisitModal({
  propertyTitle,
  analyticsLocation = "page",
  triggerLabel = "Schedule Site Visit",
  triggerVariant = "outline",
  triggerSize = "md",
  triggerClassName,
}: Props) {
  const { toast } = useToast();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(initialForm);

  function validate() {
    const e: Record<string, string> = {};
    if (form.customerName.trim().length < 2) e.customerName = "Please enter your name.";
    if (!isValidMobile(form.phone)) e.phone = "Enter a valid 10-digit mobile number.";
    if (!form.email.trim()) e.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.preferredDate) e.preferredDate = "Choose a date.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    openWhatsApp(
      siteVisitWhatsappMessage({
        propertyTitle,
        name: form.customerName,
        phone: form.phone,
        email: form.email,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        notes: form.notes,
      }),
    );
    trackAnalyticsEvent("Lead", { content_name: "Site visit request", content_category: propertyTitle });
    const page = getGa4PageContext();
    trackGa4Event(
      "whatsapp_click",
      {
        ...page,
        link_url: safeWhatsappUrl("https://wa.me/"),
        link_text: "Continue on WhatsApp",
        button_location: "site_visit_form",
        property_name: propertyTitle,
        form_id: "site_visit_form",
        transport_type: "beacon",
      },
      { dedupeKey: `whatsapp:site_visit_form:${propertyTitle}:${page.page_path}` },
    );
    toast("Your site visit request is ready in WhatsApp. Please press send there.", "success");
    setOpen(false);
    setErrors({});
  }

  function closeAndReset() {
    setOpen(false);
    setForm(initialForm());
    setErrors({});
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        data-analytics-event="select_content"
        data-analytics-content-id="site_visit"
        data-analytics-content-name={propertyTitle}
        data-analytics-location={analyticsLocation}
        className={cn(buttonVariants({ variant: triggerVariant, size: triggerSize }), triggerClassName)}
      >
        {triggerLabel}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        returnFocusRef={triggerRef}
        title="Schedule a site visit"
        description="Pick a date and time that works for you — your request opens in WhatsApp."
        footer={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" form="site-visit-form" className="w-full sm:w-auto sm:flex-1">
              <CalendarCheck className="h-4 w-4" />
              Continue on WhatsApp
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeAndReset}
              className="w-full shrink-0 border-gold/45 bg-white/5 text-white hover:border-gold hover:bg-white/10 hover:text-white focus-visible:outline-gold active:bg-white/15 sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        }
      >
        <form id="site-visit-form" onSubmit={submit} className="space-y-4">
          <div className="rounded-xl border border-gold/25 bg-espresso/50 px-4 py-3">
            <p className="text-eyebrow font-semibold uppercase tracking-wide text-white/60">Property</p>
            <p className="mt-0.5 line-clamp-1 text-nav font-semibold text-white">{propertyTitle}</p>
          </div>
          <Input
            autoFocus
            data-autofocus
            label="Full name"
            name="customerName"
            value={form.customerName}
            onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
            error={errors.customerName}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              error={errors.phone}
              required
            />
            <Input
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={errors.email}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Preferred date"
              name="preferredDate"
              type="date"
              min={todayPlus(1)}
              value={form.preferredDate}
              onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))}
              error={errors.preferredDate}
            />
            <Select
              label="Preferred time"
              name="preferredTime"
              value={form.preferredTime}
              onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))}
            >
              {["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
          <Textarea
            label="Notes (optional)"
            name="notes"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Anything we should know before the visit?"
            rows={3}
            className="min-h-0"
          />
        </form>
      </Modal>
    </>
  );
}
