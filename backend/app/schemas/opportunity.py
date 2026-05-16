"""Opportunity schemas."""

from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field


class OpportunityBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    value: float = 0.0
    stage: str = "prospecting"
    probability: int = 0
    expected_close_date: date | None = None


class OpportunityCreate(OpportunityBase):
    lead_id: str | None = None


class OpportunityUpdate(BaseModel):
    title: str | None = None
    value: float | None = None
    stage: str | None = None
    probability: int | None = None
    expected_close_date: date | None = None
    lead_id: str | None = None


class OpportunityStageUpdate(BaseModel):
    stage: str


class OpportunityResponse(OpportunityBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    lead_id: str | None
    created_at: datetime
    updated_at: datetime


class OpportunityListResponse(BaseModel):
    items: list[OpportunityResponse]
    total: int
