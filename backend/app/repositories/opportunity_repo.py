"""Opportunity repository."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.opportunity import Opportunity
from app.repositories.base_repo import BaseRepository


class OpportunityRepository(BaseRepository[Opportunity]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Opportunity)

    async def search(
        self,
        search: str | None = None,
        stage: str | None = None,
        lead_id: str | None = None,
        value_min: float | None = None,
        value_max: float | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> tuple[list[Opportunity], int]:
        query = select(Opportunity)
        count_query = select(func.count()).select_from(Opportunity)

        if search:
            query = query.where(Opportunity.title.ilike(f"%{search}%"))
            count_query = count_query.where(Opportunity.title.ilike(f"%{search}%"))

        if stage:
            query = query.where(Opportunity.stage == stage)
            count_query = count_query.where(Opportunity.stage == stage)

        if lead_id:
            query = query.where(Opportunity.lead_id == lead_id)
            count_query = count_query.where(Opportunity.lead_id == lead_id)

        if value_min is not None:
            query = query.where(Opportunity.value >= value_min)
            count_query = count_query.where(Opportunity.value >= value_min)

        if value_max is not None:
            query = query.where(Opportunity.value <= value_max)
            count_query = count_query.where(Opportunity.value <= value_max)

        query = query.order_by(Opportunity.created_at.desc()).limit(limit).offset(offset)

        result = await self.db.execute(query)
        items = list(result.scalars().all())

        count_result = await self.db.execute(count_query)
        total = count_result.scalar() or 0

        return items, total

    async def update_stage(self, opportunity_id: str, stage: str) -> Opportunity | None:
        opp = await self.get_by_id(opportunity_id)
        if opp:
            opp.stage = stage
            await self.db.commit()
            await self.db.refresh(opp)
        return opp

    async def get_pipeline_stats(self) -> dict:
        """Get pipeline stats: count and sum by stage."""
        result = await self.db.execute(
            select(Opportunity.stage, func.count(), func.sum(Opportunity.value))
            .group_by(Opportunity.stage)
        )
        rows = result.all()
        return {
            row[0]: {"count": row[1], "total_value": float(row[2] or 0)}
            for row in rows
        }
