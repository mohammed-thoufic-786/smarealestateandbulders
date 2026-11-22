"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, ShieldCheck, Sparkles, PhoneCall } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { buttonVariants } from "@/components/ui/button";
import { site, founder } from "@/lib/site";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80";

export function Hero() {
  return (
    <section className="relative flex min-h-0 items-start overflow-hidden bg-foreground pb-10 pt-20 sm:min-h-[100svh] sm:items-center sm:pb-16 sm:pt-32">
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <SmartImage
            src={HERO_IMAGE}
            alt="Modern residence at dusk in Tamil Nadu"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            fallbackLabel=""
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/95 via-foreground/80 to-foreground" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/70 to-transparent" />
        <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-gold/[0.08] blur-[130px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-gold/[0.05] blur-[150px]" />
      </div>

      <div className="container-x relative">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
          }}
          className="max-w-3xl"
        >
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 text-eyebrow font-semibold uppercase tracking-[0.22em] text-gold"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Villupuram · Chengalpattu · Salem
          </motion.p>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-balance font-display text-display-1 font-extrabold text-white"
          >
            Trust Begins Here,{" "}
            <span className="text-gold">Your Future Starts Here.</span>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-pretty text-body leading-relaxed text-white/75"
          >
            {site.name} is a Tamil Nadu real-estate company led by {founder.name}. We help families
            and investors buy residential plots, villas, apartments, agricultural land and commercial
            space — with clear paperwork, fair pricing and advisors who answer the phone.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/buy"
              className={buttonVariants({
                size: "lg",
                className: "border-gold bg-gold text-foreground hover:border-gold-400 hover:bg-gold-400",
              })}
            >
              Explore Properties <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "border-gold/50 text-gold hover:border-gold hover:bg-gold/10",
              })}
            >
              <PhoneCall className="h-4 w-4" /> Contact Us
            </Link>
          </motion.div>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-gold/80" /> Documents checked before a property is shown
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gold/80" /> 5 operating districts across Tamil Nadu
            </span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
