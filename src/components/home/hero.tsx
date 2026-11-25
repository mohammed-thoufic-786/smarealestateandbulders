"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, KeyRound, MapPin, PhoneCall, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { LOCATIONS_SERVED } from "@/lib/data/site-metrics";
import { site, founder } from "@/lib/site";
import styles from "./hero.module.css";

export function Hero() {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <section className={styles.hero} aria-label="SMA Estates & Builders">
      <SmartImage
        src="/home/sma-hero-background.png"
        alt="SMA Real Estate & Builders homes and plotted developments in Tamil Nadu"
        fill
        priority
        sizes="100vw"
        className={styles.heroImage}
      />
      <div className={styles.copy}>
        <motion.div
          className={styles.copyInner}
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className={`${styles.title} text-balance font-display`}>
            <span className={styles.titleLine}>DTCP-Approved Plots &amp; Villas</span>{" "}
            <span className={styles.titleAccent}>in Villupuram, Salem &amp; Tamil Nadu</span>
          </h1>
          <p className={styles.subtitle}>Trust Begins Here, Your Future Starts Here.</p>

          <p className={`${styles.description} text-pretty`}>
            {site.name} is a Tamil Nadu real-estate company led by {founder.name}. We help families
            and investors buy residential plots, villas, apartments, agricultural land and commercial
            space — with clear paperwork, fair pricing and advisors who answer the phone.
          </p>

          <div className={styles.actions}>
            <Link
              href="/buy"
              className={buttonVariants({ size: "lg", className: styles.primaryButton })}
            >
              Explore Properties <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: styles.secondaryButton,
              })}
            >
              <PhoneCall className="h-4 w-4" /> Talk to our team
            </Link>
          </div>
        </motion.div>
      </div>

      <p className={`${styles.trustText} text-pretty`}>
        <span className={styles.trustItem}>
          <ShieldCheck className={`${styles.trustIcon} h-3.5 w-3.5`} /> Documents checked before a property is shown
        </span>
        <span className={styles.trustDot}>·</span>
        <span className={styles.trustItem}>
          <MapPin className={`${styles.trustIcon} h-3.5 w-3.5`} /> {LOCATIONS_SERVED} towns across Tamil Nadu
        </span>
      </p>

      <motion.div
        className={styles.guidanceCard}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.guidanceIcon}>
          <KeyRound className="h-4 w-4" />
        </span>
        <span className={styles.guidanceMeta}>
          <span className={styles.guidanceTitle}>PERSONALISED PROPERTY GUIDANCE</span>
          <span className={styles.guidanceSubtitle}>
            Expert guidance to help you find the right property.
          </span>
        </span>
      </motion.div>

      <div className={styles.scrollIndicator}>
        <span>SCROLL TO EXPLORE</span>
        <ArrowDown className="h-3.5 w-3.5" />
      </div>
    </section>
  );
}
