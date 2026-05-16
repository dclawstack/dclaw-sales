"""Lead repository."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_

from app.models.lead import Lead
from app.repositories.base_repo import BaseRepository


class LeadRepository(BaseRepository[Lead]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Lead)

    async def search(
        self,
        search: str | None = None,
        status: str | None = None,
        score_min: int | None = None,
        score_max: int | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> tuple[list[Lead], int]:
        query = select(Lead)
        count_query = select(func.count()).select_from(Lead)

        if search:
            search_filter = or_(
                Lead.name.ilike(f"%{search}%"),
                Lead.email.ilike(f"%{search}%"),
                Lead.company.ilike(f"%{search}%"),
            )
            query = query.where(search_filter)
            count_query = count_query.where(search_filter)

        if status:
            query = query.where(Lead.status == status)
            count_query = count_query.where(Lead.status == status)

        if score_min is not None:
            query = query.where(Lead.score >= score_min)
            count_query = count_query.where(Lead.score >= score_min)

        if score_max is not None:
            query = query.where(Lead.score <= score_max)
            count_query = count_query.where(Lead.score <= score_max)

        query = query.order_by(Lead.created_at.desc()).limit(limit).offset(offset)

        result = await self.db.execute(query)
        items = list(result.scalars().all())

        count_result = await self.db.execute(count_query)
        total = count_result.scalar() or 0

        return items, total

    async def bulk_update_status(self, ids: list[str], status: str) -> int:
        result = await self.db.execute(
            select(Lead).where(Lead.id.in_(ids))
        )
        leads = list(result.scalars().all())
        for lead in leads:
            lead.status = status
        await self.db.commit()
        return len(leads)

    async def bulk_delete(self, ids: list[str]) -> int:
        result = await self.db.execute(
            select(Lead).where(Lead.id.in_(ids))
        )
        leads = list(result.scalars().all())
        for lead in leads:
            await self.db.delete(lead)
        await self.db.commit()
        return len(leads)
