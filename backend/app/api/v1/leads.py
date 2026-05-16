"""Lead API routes."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.lead_repo import LeadRepository
from app.schemas.lead import (
    LeadCreate,
    LeadUpdate,
    LeadResponse,
    LeadListResponse,
    LeadBulkDeleteRequest,
    LeadBulkStatusRequest,
)

router = APIRouter()


def get_lead_repo(db: AsyncSession = Depends(get_db)) -> LeadRepository:
    return LeadRepository(db)


@router.get("/", response_model=LeadListResponse)
async def list_leads(
    search: str | None = Query(None, description="Search by name, email, or company"),
    status: str | None = Query(None, description="Filter by status"),
    score_min: int | None = Query(None, description="Minimum score"),
    score_max: int | None = Query(None, description="Maximum score"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    repo: LeadRepository = Depends(get_lead_repo),
):
    items, total = await repo.search(
        search=search,
        status=status,
        score_min=score_min,
        score_max=score_max,
        limit=limit,
        offset=offset,
    )
    return LeadListResponse(
        items=[LeadResponse.model_validate(item) for item in items],
        total=total,
    )


@router.post("/", response_model=LeadResponse, status_code=201)
async def create_lead(
    data: LeadCreate,
    repo: LeadRepository = Depends(get_lead_repo),
):
    from app.models.lead import Lead
    lead = Lead(**data.model_dump())
    result = await repo.create(lead)
    return LeadResponse.model_validate(result)


@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(
    lead_id: str,
    repo: LeadRepository = Depends(get_lead_repo),
):
    lead = await repo.get_by_id(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return LeadResponse.model_validate(lead)


@router.patch("/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: str,
    data: LeadUpdate,
    repo: LeadRepository = Depends(get_lead_repo),
):
    lead = await repo.get_by_id(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(lead, key, value)
    await repo.db.commit()
    await repo.db.refresh(lead)
    return LeadResponse.model_validate(lead)


@router.delete("/{lead_id}", status_code=204)
async def delete_lead(
    lead_id: str,
    repo: LeadRepository = Depends(get_lead_repo),
):
    lead = await repo.get_by_id(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    await repo.delete(lead)


@router.post("/bulk-delete", status_code=204)
async def bulk_delete_leads(
    data: LeadBulkDeleteRequest,
    repo: LeadRepository = Depends(get_lead_repo),
):
    await repo.bulk_delete(data.ids)


@router.post("/bulk-status", response_model=dict)
async def bulk_update_status(
    data: LeadBulkStatusRequest,
    repo: LeadRepository = Depends(get_lead_repo),
):
    count = await repo.bulk_update_status(data.ids, data.status)
    return {"updated": count}
