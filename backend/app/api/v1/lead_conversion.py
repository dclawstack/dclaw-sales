"""Lead → Opportunity conversion."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.lead_repo import LeadRepository
from app.repositories.opportunity_repo import OpportunityRepository
from app.schemas.opportunity import OpportunityResponse

router = APIRouter()


@router.post("/{lead_id}/convert", response_model=OpportunityResponse, status_code=201)
async def convert_lead_to_opportunity(
    lead_id: str,
    db: AsyncSession = Depends(get_db),
):
    lead_repo = LeadRepository(db)
    opp_repo = OpportunityRepository(db)

    lead = await lead_repo.get_by_id(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    from app.models.opportunity import Opportunity

    opp = Opportunity(
        lead_id=lead.id,
        title=f"{lead.name} — {lead.company or 'New Opportunity'}",
        value=0.0,
        stage="prospecting",
        probability=0,
    )
    result = await opp_repo.create(opp)

    lead.status = "qualified"
    await db.commit()
    await db.refresh(lead)

    return OpportunityResponse.model_validate(result)
