"""Lead schemas."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class LeadBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: str = Field(min_length=1, max_length=255)
    phone: str | None = None
    company: str | None = None
    source: str | None = None
    status: str = "new"
    assigned_to: str | None = None


class LeadCreate(LeadBase):
    score: int = 0


class LeadUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    company: str | None = None
    source: str | None = None
    score: int | None = None
    status: str | None = None
    assigned_to: str | None = None


class LeadResponse(LeadBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    score: int
    created_at: datetime
    updated_at: datetime


class LeadListResponse(BaseModel):
    items: list[LeadResponse]
    total: int


class LeadBulkDeleteRequest(BaseModel):
    ids: list[str]


class LeadBulkStatusRequest(BaseModel):
    ids: list[str]
    status: str
