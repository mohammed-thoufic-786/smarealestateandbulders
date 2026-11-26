import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  path,
}: {
  items: BreadcrumbItem[];
  path?: string;
}) {
  const trail: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...items];
  const jsonLd = breadcrumbJsonLd(
    items,
    path ?? items[items.length - 1]?.href ?? "/",
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          {trail.map((item, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.href && !last ? (
                  <Link href={item.href} className="hover:text-gold">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined}>{item.label}</span>
                )}
                {!last && <span aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
