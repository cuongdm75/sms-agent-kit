"""
PA SMS Online — Pydantic Schema Template
==========================================
Copy this pattern when creating request/response models.

CRITICAL RULES:
1. Use Field(alias="camelCase") for JSON keys
2. Set populate_by_name = True in Config
3. Use from_attributes = True for Prisma ORM mapping
4. Follow Base → Create → Response inheritance
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID


# ── Base (shared fields) ─────────────────────────────────────────
class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "draft"


# ── Create (input from client) ──────────────────────────────────
class ItemCreate(ItemBase):
    """Fields needed to create a new item."""
    branch_id: Optional[UUID] = Field(default=None, alias="branchId")
    assigned_to: Optional[UUID] = Field(default=None, alias="assignedTo")

    class Config:
        populate_by_name = True


# ── Response (output to client) ──────────────────────────────────
class ItemResponse(ItemBase):
    """Full item with DB-generated fields."""
    id: UUID
    branch_id: UUID = Field(alias="branchId")
    created_by: str = Field(alias="createdBy")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")

    class Config:
        from_attributes = True      # Map from Prisma ORM objects
        populate_by_name = True     # Accept both snake_case and camelCase


# ── Nested Response ──────────────────────────────────────────────
class ItemDetailResponse(ItemResponse):
    """Extended response with related data."""
    related_items: List[ItemResponse] = Field(default=[], alias="relatedItems")
    assignee: Optional[dict] = None

    class Config:
        from_attributes = True
        populate_by_name = True


# ── Update (partial) ────────────────────────────────────────────
class ItemUpdate(BaseModel):
    """Only updatable fields. All optional."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

    class Config:
        populate_by_name = True
