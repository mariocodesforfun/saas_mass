from __future__ import annotations

from typing import Optional

import httpx

from app.core.config import get_settings


def service_headers() -> dict[str, str]:
    settings = get_settings()

    if not settings.supabase_service_role_key:
        raise RuntimeError("SUPABASE_SERVICE_ROLE_KEY is required for service database calls.")

    return {
        "apikey": settings.supabase_service_role_key,
        "authorization": f"Bearer {settings.supabase_service_role_key}",
        "content-type": "application/json",
    }


async def get_membership(user_id: str, organization_id: str) -> Optional[dict]:
    settings = get_settings()
    url = f"{settings.supabase_url}/rest/v1/memberships"
    params = {
        "user_id": f"eq.{user_id}",
        "organization_id": f"eq.{organization_id}",
        "select": "role",
        "limit": "1",
    }

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url, headers=service_headers(), params=params)
        response.raise_for_status()

    rows = response.json()
    return rows[0] if rows else None
