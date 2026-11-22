import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { notify } from "@/lib/notifications";
import { site } from "@/lib/site";

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "newsletter"), 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 422 });
  }

  await notify({
    email: parsed.data.email,
    subject: `Welcome to ${site.name}`,
    text: [
      `Thanks for subscribing to ${site.name}.`,
      "You'll receive new listings and property updates for Tamil Nadu — no spam, unsubscribe anytime.",
    ].join("\n"),
    notifyAdmin: true,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
