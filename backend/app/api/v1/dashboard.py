"""Dashboard API routes."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.lead import Lead
from app.models.opportunity import Opportunity
from app.models.quote import Quote

router = APIRouter()


@router.get("/")
async def dashboard_stats(db: AsyncSession = Depends(get_db)):
    # Lead stats
    total_leads_result = await db.execute(select(func.count()).select_from(Lead))
    total_leads = total_leads_result.scalar() or 0

    new_leads_result = await db.execute(
        select(func.count()).select_from(Lead).where(Lead.status == "new")
    )
    new_leads = new_leads_result.scalar() or 0

    contacted_leads_result = await db.execute(
        select(func.count()).select_from(Lead).where(Lead.status == "contacted")
    )
    contacted_leads = contacted_leads_result.scalar() or 0

    qualified_leads_result = await db.execute(
        select(func.count()).select_from(Lead).where(Lead.status == "qualified")
    )
    qualified_leads = qualified_leads_result.scalar() or 0

    lost_leads_result = await db.execute(
        select(func.count()).select_from(Lead).where(Lead.status == "lost")
    )
    lost_leads = lost_leads_result.scalar() or 0

    # Opportunity stats
    total_opps_result = await db.execute(select(func.count()).select_from(Opportunity))
    total_opps = total_opps_result.scalar() or 0

    pipeline_value_result = await db.execute(
        select(func.sum(Opportunity.value)).where(
            Opportunity.stage.notin_(["closed_won", "closed_lost"])
        )
    )
    pipeline_value = float(pipeline_value_result.scalar() or 0)

    closed_won_value_result = await db.execute(
        select(func.sum(Opportunity.value)).where(Opportunity.stage == "closed_won")
    )
    closed_won_value = float(closed_won_value_result.scalar() or 0)

    # Win rate
    closed_won_count_result = await db.execute(
        select(func.count()).select_from(Opportunity).where(Opportunity.stage == "closed_won")
    )
    closed_won_count = closed_won_count_result.scalar() or 0

    closed_lost_count_result = await db.execute(
        select(func.count()).select_from(Opportunity).where(Opportunity.stage == "closed_lost")
    )
    closed_lost_count = closed_lost_count_result.scalar() or 0

    total_closed = closed_won_count + closed_lost_count
    win_rate = round((closed_won_count / total_closed * 100)) if total_closed > 0 else 0

    # Opportunities by stage
    stage_results = await db.execute(
        select(Opportunity.stage, func.count(), func.sum(Opportunity.value))
        .group_by(Opportunity.stage)
    )
    pipeline_by_stage = {
        row[0]: {"count": row[1], "total_value": float(row[2] or 0)}
        for row in stage_results.all()
    }

    # Quote stats
    total_quotes_result = await db.execute(select(func.count()).select_from(Quote))
    total_quotes = total_quotes_result.scalar() or 0

    accepted_quotes_result = await db.execute(
        select(func.count()).select_from(Quote).where(Quote.status == "accepted")
    )
    accepted_quotes = accepted_quotes_result.scalar() or 0

    # Recent leads
    recent_leads_result = await db.execute(
        select(Lead).order_by(Lead.created_at.desc()).limit(5)
    )
    recent_leads = []
    for lead in recent_leads_result.scalars().all():
        recent_leads.append({
            "id": lead.id,
            "name": lead.name,
            "email": lead.email,
            "company": lead.company,
            "status": lead.status,
            "score": lead.score,
            "created_at": lead.created_at.isoformat() if lead.created_at else None,
        })

    return {
        "leads": {
            "total": total_leads,
            "new": new_leads,
            "contacted": contacted_leads,
            "qualified": qualified_leads,
            "lost": lost_leads,
        },
        "opportunities": {
            "total": total_opps,
            "pipeline_value": pipeline_value,
            "closed_won_value": closed_won_value,
            "win_rate": win_rate,
            "by_stage": pipeline_by_stage,
        },
        "quotes": {
            "total": total_quotes,
            "accepted": accepted_quotes,
        },
        "recent_leads": recent_leads,
    }
