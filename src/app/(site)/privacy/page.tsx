import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects your personal information.`,
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    h: "1. Information we collect",
    p: "We collect information you provide directly — such as your name, phone number, email and property requirements when you submit an enquiry, request a callback, schedule a site visit or create an account. We also collect limited technical data such as device type and pages viewed to improve the platform.",
  },
  {
    h: "2. How we use your information",
    p: "We use your details to respond to enquiries, connect you with relevant advisors, send appointment confirmations and reminders, personalise property recommendations and improve our services. We do not sell your personal data to third parties.",
  },
  {
    h: "3. Consent and communication",
    p: "We contact you only in relation to your enquiries or with your consent. You can withdraw consent or ask us to stop marketing communications at any time by contacting us.",
  },
  {
    h: "4. Sharing with third parties",
    p: "We may share limited details with the specific owner or agent connected to a property you enquire about, so they can respond. We use trusted service providers (hosting, storage, messaging) who process data on our behalf under contract.",
  },
  {
    h: "5. Data security",
    p: "We use industry-standard measures including encryption in transit, hashed passwords, access controls and rate limiting. No method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
  },
  {
    h: "6. Data retention",
    p: "We retain enquiry and account data for as long as needed to provide our services and meet legal obligations, after which it is deleted or anonymised.",
  },
  {
    h: "7. Your rights",
    p: "You may request access to, correction of, or deletion of your personal data, subject to applicable law. Contact us to exercise these rights.",
  },
  {
    h: "8. Cookies",
    p: "We use essential cookies for authentication and basic analytics cookies to understand usage. You can control cookies through your browser settings.",
  },
  {
    h: "9. Changes to this policy",
    p: "We may update this policy from time to time. Material changes will be posted on this page with an updated effective date.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-cream">
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Your privacy matters. This policy explains what we collect, why, and the choices you have."
        breadcrumb={[{ href: "/privacy", label: "Privacy" }]}
      />
      <div className="container-x py-8 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
          <p className="text-sm text-muted">Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-subheading font-semibold text-foreground">{s.h}</h2>
              <p className="mt-2 text-body leading-relaxed text-muted">{s.p}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
