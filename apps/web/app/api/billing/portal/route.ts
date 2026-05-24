import { NextResponse } from "next/server";
import { getActiveOrganization, requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const user = await requireUser();
  const membership = await getActiveOrganization(user.id);
  const organization = Array.isArray(membership?.organizations)
    ? membership?.organizations[0]
    : membership?.organizations;

  if (!organization?.id) {
    return NextResponse.json({ error: "No organization found." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("organization_id", organization.id)
    .maybeSingle();

  if (!data?.stripe_customer_id) {
    return NextResponse.json({ error: "No Stripe customer found." }, { status: 400 });
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id as string,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/settings/billing`
  });

  return NextResponse.redirect(session.url, { status: 303 });
}
