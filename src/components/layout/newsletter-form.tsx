"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/components/providers/app-providers";

export function NewsletterForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Please enter a valid email address.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      toast("You're subscribed. Welcome aboard.", "success");
      setEmail("");
    } catch {
      toast("Subscription failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 rounded-full border border-gold/25 bg-primary p-1.5 pl-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
        className="min-w-0 flex-1 bg-transparent text-body text-white placeholder:text-cream/60 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-primary-deep transition-colors hover:bg-gold-400 disabled:opacity-60"
        aria-label="Subscribe"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
