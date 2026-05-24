from __future__ import annotations

from typing import Annotated, Any, Optional

import jwt
from fastapi import Depends, Header, HTTPException, status

from app.core.config import Settings, get_settings


class SupabaseUser:
    def __init__(self, claims: dict[str, Any]) -> None:
        self.claims = claims
        self.id = str(claims.get("sub", ""))
        self.email = claims.get("email")
        self.role = claims.get("role")


def _bearer_token(authorization: str | None) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )

    return authorization.split(" ", 1)[1]


def require_user(
    authorization: Annotated[Optional[str], Header()] = None,
    settings: Settings = Depends(get_settings),
) -> SupabaseUser:
    token = _bearer_token(authorization)

    try:
        claims = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
            options={"verify_aud": False},
        )
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Supabase token",
        ) from exc

    user = SupabaseUser(claims)

    if not user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token does not include a user id",
        )

    return user
