"""Sales API routes."""

import random
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class LeadRequest(BaseModel):
    name: str
    email: str
    deal_value: float


class LeadResponse(BaseModel):
    id: str
    name: str
    email: str
    deal_value: float
    score: int
    status: str
    created_at: str


class EmailSequenceItem(BaseModel):
    step_number: int
    subject: str
    body_template: str
    delay_days: int


@router.post("/leads", response_model=LeadResponse)
async def create_lead(request: LeadRequest) -> LeadResponse:
    return LeadResponse(
        id=str(uuid.uuid4()),
        name=request.name,
        email=request.email,
        deal_value=request.deal_value,
        score=random.randint(1, 100),
        status="qualified",
        created_at=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/leads/{id}/sequence", response_model=list[EmailSequenceItem])
async def get_email_sequence(id: str) -> list[EmailSequenceItem]:
    return [
        EmailSequenceItem(
            step_number=1,
            subject="Welcome to DClaw",
            body_template="Hi {{name}}, welcome aboard! Let's explore how we can help you grow.",
            delay_days=0,
        ),
        EmailSequenceItem(
            step_number=2,
            subject="Case Study: 3x ROI in 90 days",
            body_template="Hi {{name}}, see how a similar company achieved 3x ROI using our platform.",
            delay_days=2,
        ),
        EmailSequenceItem(
            step_number=3,
            subject="Quick question about {{company}}",
            body_template="Hi {{name}}, I had a quick idea for {{company}}. Mind if I share?",
            delay_days=5,
        ),
        EmailSequenceItem(
            step_number=4,
            subject="Exclusive offer inside",
            body_template="Hi {{name}}, we'd love to offer you an exclusive onboarding package.",
            delay_days=7,
        ),
        EmailSequenceItem(
            step_number=5,
            subject="Final check-in",
            body_template="Hi {{name}}, just checking in one last time. Let me know if you have questions.",
            delay_days=14,
        ),
    ]
