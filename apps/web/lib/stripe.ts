import Stripe from "stripe";
import { env } from "@/lib/env";

export function getStripe() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is required for billing operations.");
  }

  return new Stripe(env.STRIPE_SECRET_KEY);
}
