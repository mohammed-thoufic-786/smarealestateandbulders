"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/providers/app-providers";
import { isValidMobile } from "@/lib/validation";
import { contactWhatsappMessage } from "@/lib/business-config";
import { openWhatsApp } from "@/lib/whatsapp";

function emptyForm() {
  return { name: "", phone: "", email: "", message: "" };
}

export function ContactForm() {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(emptyForm);

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    if (!isValidMobile(form.phone)) e.phone = "Enter a valid 10-digit mobile number.";
    if (!form.email.trim()) e.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.message.trim().length < 5) e.message = "Tell us a little more.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    openWhatsApp(contactWhatsappMessage(form));
    toast("Your enquiry is ready in WhatsApp. Please press send there.", "success");
    setErrors({});
    setForm(emptyForm());
  }

  return (
    <form onSubmit={submit} className="min-w-0 space-y-4 rounded-2xl border border-gold/25 bg-deep p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full name"
          name="name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          error={errors.name}
          required
        />
        <Input
          label="Phone number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          error={errors.phone}
          required
        />
      </div>
      <Input
        label="Email address"
        name="email"
        type="email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        error={errors.email}
        required
      />
      <Textarea
        label="Message"
        name="message"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        error={errors.message}
        placeholder="Tell us how we can help…"
        required
      />
      <p className="text-sm leading-relaxed text-white/60">
        Submitting opens WhatsApp with your details prefilled. You can review and send the message there.
      </p>
      <Button type="submit" size="lg" className="w-full">
        <Send className="h-4 w-4" />
        Send via WhatsApp
      </Button>
    </form>
  );
}
