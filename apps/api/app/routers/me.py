from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from app.core.auth import SupabaseUser, require_user

router = APIRouter(prefix="/me", tags=["me"])


@router.get("")
def me(user: SupabaseUser = Depends(require_user)) -> dict[str, Optional[str]]:
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
    }
