import { NextResponse } from "next/server";
import { getActiveOrganization, requireUser } from "@/lib/auth";
import { getBillingRedirects, getOrCreateStripeCustomer } from "@/lib/billing";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const user = await requireUser();
  const membership = await getActiveOrganization(user.id);
  const organization = Array.isArray(membership?.organizations)
    ? membership?.organizations[0]
    : membership?.organizations;

  if (!organization?.id || !env.STRIPE_PRICE_PRO) {
    return NextResponse.json({ error: "Billing is not configured." }, { status: 400 });
  }

  const customer = await getOrCreateStripeCustomer({
    organizationId: organization.id,
    organizationName: organization.name,
    email: user.email ?? ""
  });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer,
    line_items: [{ price: env.STRIPE_PRICE_PRO, quantity: 1 }],
    client_reference_id: organization.id,
    subscription_data: {
      metadata: {
        organization_id: organization.id
      }
    },
    ...getBillingRedirects()
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
  }

  return NextResponse.redirect(session.url, { status: 303 });
}
