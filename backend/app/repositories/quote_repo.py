"""Quote repository."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.quote import Quote
from app.repositories.base_repo import BaseRepository


class QuoteRepository(BaseRepository[Quote]):
    def __init__(self, db: AsyncSession):
        super().__init__(db, Quote)

    async def search(
        self,
        status: str | None = None,
        opportunity_id: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> tuple[list[Quote], int]:
        query = select(Quote)
        count_query = select(func.count()).select_from(Quote)

        if status:
            query = query.where(Quote.status == status)
            count_query = count_query.where(Quote.status == status)

        if opportunity_id:
            query = query.where(Quote.opportunity_id == opportunity_id)
            count_query = count_query.where(Quote.opportunity_id == opportunity_id)

        query = query.order_by(Quote.created_at.desc()).limit(limit).offset(offset)

        result = await self.db.execute(query)
        items = list(result.scalars().all())

        count_result = await self.db.execute(count_query)
        total = count_result.scalar() or 0

        return items, total
