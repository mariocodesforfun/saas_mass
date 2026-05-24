export type PlanKey = "free" | "pro" | "business";

export type Entitlement = {
  canInviteMembers: boolean;
  maxSeats: number;
  maxProjects: number;
  hasApiAccess: boolean;
};

const entitlements: Record<PlanKey, Entitlement> = {
  free: {
    canInviteMembers: false,
    maxSeats: 1,
    maxProjects: 2,
    hasApiAccess: false
  },
  pro: {
    canInviteMembers: true,
    maxSeats: 5,
    maxProjects: 25,
    hasApiAccess: true
  },
  business: {
    canInviteMembers: true,
    maxSeats: 25,
    maxProjects: 250,
    hasApiAccess: true
  }
};

export function getEntitlements(plan: string | null | undefined): Entitlement {
  if (plan === "pro" || plan === "business") {
    return entitlements[plan];
  }

  return entitlements.free;
}

export function requireEntitlement(
  plan: string | null | undefined,
  predicate: (entitlement: Entitlement) => boolean,
  message = "Your current plan does not include this feature."
) {
  const entitlement = getEntitlements(plan);

  if (!predicate(entitlement)) {
    throw new Error(message);
  }

  return entitlement;
}
