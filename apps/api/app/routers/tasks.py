from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import SupabaseUser, require_user
from app.core.supabase import get_membership

router = APIRouter(prefix="/tasks", tags=["tasks"])


class TaskRequest(BaseModel):
    organization_id: str
    prompt: str


@router.post("/run")
async def run_task(
    payload: TaskRequest,
    user: SupabaseUser = Depends(require_user),
) -> dict[str, str]:
    membership = await get_membership(user.id, payload.organization_id)

    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a member of this organization.",
        )

    return {
        "status": "queued",
        "organization_id": payload.organization_id,
        "message": "Replace this stub with product-specific Python work.",
    }
