"""
PA SMS Online — API Endpoint Template
=======================================
Copy this pattern when creating a new API module.
Replace 'safety_walk' with your module name.

Steps to add a new endpoint:
1. Create this file in app/api/v1/endpoints/{module}.py
2. Register in app/api/v1/api.py:
   from app.api.v1.endpoints import {module}
   api_router.include_router({module}.router, prefix="/{module}", tags=["{module}"])
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import logging

from app.api.deps import get_current_active_user
from app.core.database import db

logger = logging.getLogger(__name__)

router = APIRouter()


# ── LIST (GET /) ─────────────────────────────────────────────────
@router.get("/plans")
async def list_plans(
    status: str = None,
    current_user=Depends(get_current_active_user),
):
    """List all plans, optionally filtered by status."""
    try:
        where = {"branchId": current_user.branchId}
        if status:
            where["status"] = status

        plans = await db.safetywalkplan.find_many(
            where=where,
            order={"createdAt": "desc"},
        )
        return plans
    except Exception:
        logger.exception("Failed to list plans")
        raise HTTPException(status_code=500, detail="Internal server error")


# ── GET BY ID (GET /{id}) ────────────────────────────────────────
@router.get("/plans/{plan_id}")
async def get_plan(
    plan_id: str,
    current_user=Depends(get_current_active_user),
):
    """Get a single plan with related data."""
    try:
        plan = await db.safetywalkplan.find_unique(
            where={"id": plan_id},
            include={
                "template": {
                    "include": {
                        "sections": {
                            "include": {"items": True},
                            "order": {"order": "asc"},
                        }
                    }
                },
                "result": {"include": {"items": True}},
            },
        )
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        return plan
    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Failed to get plan {plan_id}")
        raise HTTPException(status_code=500, detail="Internal server error")


# ── CREATE (POST /) ──────────────────────────────────────────────
@router.post("/plans", status_code=status.HTTP_201_CREATED)
async def create_plan(
    payload: dict,  # Use Pydantic schema in real code
    current_user=Depends(get_current_active_user),
):
    """Create a new plan."""
    try:
        plan = await db.safetywalkplan.create(
            data={
                "title": payload["title"],
                "branchId": current_user.branchId,
                "createdBy": current_user.id,
                "status": "draft",
                # ... other fields
            }
        )
        return plan
    except Exception:
        logger.exception("Failed to create plan")
        raise HTTPException(status_code=500, detail="Internal server error")


# ── UPDATE (PUT /{id}) ───────────────────────────────────────────
@router.put("/plans/{plan_id}")
async def update_plan(
    plan_id: str,
    payload: dict,
    current_user=Depends(get_current_active_user),
):
    """Update an existing plan."""
    try:
        existing = await db.safetywalkplan.find_unique(where={"id": plan_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Plan not found")

        updated = await db.safetywalkplan.update(
            where={"id": plan_id},
            data=payload,
        )
        return updated
    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Failed to update plan {plan_id}")
        raise HTTPException(status_code=500, detail="Internal server error")


# ── DELETE (DELETE /{id}) — Admin only ───────────────────────────
@router.delete("/plans/{plan_id}")
async def delete_plan(
    plan_id: str,
    current_user=Depends(get_current_active_user),
):
    """Delete a plan. Admin/Manager only."""
    if current_user.role not in ("admin", "sysadmin", "sm_manager"):
        raise HTTPException(status_code=403, detail="Not authorized")

    try:
        await db.safetywalkplan.delete(where={"id": plan_id})
        return {"ok": True}
    except Exception:
        logger.exception(f"Failed to delete plan {plan_id}")
        raise HTTPException(status_code=500, detail="Internal server error")
