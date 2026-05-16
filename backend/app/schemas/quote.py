"""Quote schemas."""

from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field


class QuoteBase(BaseModel):
    items: list[dict] | None = None
    total: float = 0.0
    status: str = "draft"
    valid_until: date | None = None


class QuoteCreate(QuoteBase):
    opportunity_id: str


class QuoteUpdate(BaseModel):
    items: dict | None = None
    total: float | None = None
    status: str | None = None
    valid_until: date | None = None


class QuoteResponse(QuoteBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    opportunity_id: str
    created_at: datetime
    updated_at: datetime


class QuoteListResponse(BaseModel):
    items: list[QuoteResponse]
    total: int
