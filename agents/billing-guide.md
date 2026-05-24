# Billing Guide

Stripe is the billing source of truth. The app mirrors subscription state into `public.subscriptions`.

## Add a Paid Feature

1. Define the plan behavior in `apps/web/lib/entitlements.ts`.
2. Check the current organization's subscription before performing the action.
3. For server-only features, use service role reads only in server code.
4. For Python features, fetch subscription state through Supabase REST using the service role.

## Webhook Rule

All subscription state changes must flow through `apps/web/app/api/webhooks/stripe/route.ts`.
Do not trust client-provided plan names.
