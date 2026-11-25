import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Terms & Conditions | SMA Real Estate",
    description:
      "Terms governing the use of the SMA Real Estate & Builders website, its property information and enquiry services.",
    path: "/terms",
  });
}

const SECTIONS = [
  {
    h: "1. Acceptance of terms",
    p: `By accessing or using the ${site.name} platform, you agree to these terms. If you do not agree, please do not use the platform.`,
  },
  {
    h: "2. Nature of the service",
    p: `${site.name} is a real estate company that helps property owners and buyers or tenants connect. We are not a party to any transaction between users and do not own the properties listed unless expressly stated.`,
  },
  {
    h: "3. Listings and accuracy",
    p: "Property details, prices, images and availability are provided by owners. While we review listings, we cannot guarantee the accuracy or completeness of any information. You must independently verify all details before transacting.",
  },
  {
    h: "4. Verified badge",
    p: "A 'Verified' badge indicates that our team has reviewed the documents shared for that listing. It is not a guarantee of title, approvals, legality or value, and should not be relied upon as such.",
  },
  {
    h: "5. User responsibilities",
    p: "You agree to provide accurate information, to use the platform lawfully, and not to post false listings, misrepresent property details or engage in fraudulent or abusive behaviour.",
  },
  {
    h: "6. No financial or legal advice",
    p: "Content on the platform, including guides and resources, is for general information only and does not constitute financial, investment, legal or tax advice. Consult qualified professionals before making decisions.",
  },
  {
    h: "7. Fees",
    p: "Browsing and enquiring are free for buyers and tenants. Any fees for listing or premium services will be disclosed clearly before you incur them.",
  },
  {
    h: "8. Intellectual property",
    p: "The platform, its design, code and content are owned by us or our licensors and may not be copied or reused without permission.",
  },
  {
    h: "9. Limitation of liability",
    p: "To the maximum extent permitted by law, we are not liable for any indirect or consequential loss arising from your use of the platform or any transaction between users.",
  },
  {
    h: "10. Governing law",
    p: "These terms are governed by the laws of India, and disputes are subject to the exclusive jurisdiction of the courts of Villupuram, Tamil Nadu.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-cream">
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description={`Please read these terms carefully before using the ${site.name} platform.`}
        breadcrumb={[{ href: "/terms", label: "Terms" }]}
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
