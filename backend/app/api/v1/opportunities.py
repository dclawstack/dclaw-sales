"""Opportunity API routes."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.opportunity_repo import OpportunityRepository
from app.schemas.opportunity import (
    OpportunityCreate,
    OpportunityUpdate,
    OpportunityStageUpdate,
    OpportunityResponse,
    OpportunityListResponse,
)

router = APIRouter()


def get_opportunity_repo(db: AsyncSession = Depends(get_db)) -> OpportunityRepository:
    return OpportunityRepository(db)


@router.get("/", response_model=OpportunityListResponse)
async def list_opportunities(
    search: str | None = Query(None, description="Search by title"),
    stage: str | None = Query(None, description="Filter by stage"),
    lead_id: str | None = Query(None, description="Filter by lead"),
    value_min: float | None = Query(None, description="Minimum value"),
    value_max: float | None = Query(None, description="Maximum value"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    repo: OpportunityRepository = Depends(get_opportunity_repo),
):
    items, total = await repo.search(
        search=search,
        stage=stage,
        lead_id=lead_id,
        value_min=value_min,
        value_max=value_max,
        limit=limit,
        offset=offset,
    )
    return OpportunityListResponse(
        items=[OpportunityResponse.model_validate(item) for item in items],
        total=total,
    )


@router.post("/", response_model=OpportunityResponse, status_code=201)
async def create_opportunity(
    data: OpportunityCreate,
    repo: OpportunityRepository = Depends(get_opportunity_repo),
):
    from app.models.opportunity import Opportunity
    opp = Opportunity(**data.model_dump())
    result = await repo.create(opp)
    return OpportunityResponse.model_validate(result)


@router.get("/{opportunity_id}", response_model=OpportunityResponse)
async def get_opportunity(
    opportunity_id: str,
    repo: OpportunityRepository = Depends(get_opportunity_repo),
):
    opp = await repo.get_by_id(opportunity_id)
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return OpportunityResponse.model_validate(opp)


@router.patch("/{opportunity_id}", response_model=OpportunityResponse)
async def update_opportunity(
    opportunity_id: str,
    data: OpportunityUpdate,
    repo: OpportunityRepository = Depends(get_opportunity_repo),
):
    opp = await repo.get_by_id(opportunity_id)
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(opp, key, value)
    await repo.db.commit()
    await repo.db.refresh(opp)
    return OpportunityResponse.model_validate(opp)


@router.delete("/{opportunity_id}", status_code=204)
async def delete_opportunity(
    opportunity_id: str,
    repo: OpportunityRepository = Depends(get_opportunity_repo),
):
    opp = await repo.get_by_id(opportunity_id)
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    await repo.delete(opp)


@router.patch("/{opportunity_id}/stage", response_model=OpportunityResponse)
async def update_opportunity_stage(
    opportunity_id: str,
    data: OpportunityStageUpdate,
    repo: OpportunityRepository = Depends(get_opportunity_repo),
):
    opp = await repo.update_stage(opportunity_id, data.stage)
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return OpportunityResponse.model_validate(opp)
