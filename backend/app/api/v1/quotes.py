"""Quote API routes."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.quote_repo import QuoteRepository
from app.schemas.quote import (
    QuoteCreate,
    QuoteUpdate,
    QuoteResponse,
    QuoteListResponse,
)

router = APIRouter()


def get_quote_repo(db: AsyncSession = Depends(get_db)) -> QuoteRepository:
    return QuoteRepository(db)


@router.get("/", response_model=QuoteListResponse)
async def list_quotes(
    status: str | None = Query(None, description="Filter by status"),
    opportunity_id: str | None = Query(None, description="Filter by opportunity"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    repo: QuoteRepository = Depends(get_quote_repo),
):
    items, total = await repo.search(
        status=status,
        opportunity_id=opportunity_id,
        limit=limit,
        offset=offset,
    )
    return QuoteListResponse(
        items=[QuoteResponse.model_validate(item) for item in items],
        total=total,
    )


@router.post("/", response_model=QuoteResponse, status_code=201)
async def create_quote(
    data: QuoteCreate,
    repo: QuoteRepository = Depends(get_quote_repo),
):
    from app.models.quote import Quote
    quote = Quote(**data.model_dump())
    result = await repo.create(quote)
    return QuoteResponse.model_validate(result)


@router.get("/{quote_id}", response_model=QuoteResponse)
async def get_quote(
    quote_id: str,
    repo: QuoteRepository = Depends(get_quote_repo),
):
    quote = await repo.get_by_id(quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return QuoteResponse.model_validate(quote)


@router.patch("/{quote_id}", response_model=QuoteResponse)
async def update_quote(
    quote_id: str,
    data: QuoteUpdate,
    repo: QuoteRepository = Depends(get_quote_repo),
):
    quote = await repo.get_by_id(quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(quote, key, value)
    await repo.db.commit()
    await repo.db.refresh(quote)
    return QuoteResponse.model_validate(quote)


@router.delete("/{quote_id}", status_code=204)
async def delete_quote(
    quote_id: str,
    repo: QuoteRepository = Depends(get_quote_repo),
):
    quote = await repo.get_by_id(quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    await repo.delete(quote)
