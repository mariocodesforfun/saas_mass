import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export async function getOrCreateStripeCustomer({
  organizationId,
  organizationName,
  email
}: {
  organizationId: string;
  organizationName: string;
  email: string;
}) {
  const supabase = createAdminClient();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (subscription?.stripe_customer_id) {
    return subscription.stripe_customer_id as string;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email,
    name: organizationName,
    metadata: {
      organization_id: organizationId
    }
  });

  await supabase.from("subscriptions").upsert({
    organization_id: organizationId,
    stripe_customer_id: customer.id,
    plan_key: "free",
    status: "incomplete"
  });

  return customer.id;
}

export function getBillingRedirects() {
  return {
    success_url: `${env.NEXT_PUBLIC_APP_URL}/settings/billing?checkout=success`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/settings/billing?checkout=cancelled`
  };
}
