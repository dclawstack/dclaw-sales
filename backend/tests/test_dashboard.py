"""Tests for Dashboard API."""

import pytest


@pytest.mark.asyncio
async def test_dashboard_empty(client):
    response = await client.get("/api/v1/dashboard/")
    assert response.status_code == 200
    data = response.json()
    assert data["leads"]["total"] == 0
    assert data["opportunities"]["total"] == 0
    assert data["quotes"]["total"] == 0


@pytest.mark.asyncio
async def test_dashboard_with_data(client):
    # Create leads with different statuses
    await client.post(
        "/api/v1/leads/",
        json={"name": "Lead1", "email": "lead1@test.com", "status": "new"},
    )
    await client.post(
        "/api/v1/leads/",
        json={"name": "Lead2", "email": "lead2@test.com", "status": "qualified"},
    )

    # Create opportunities
    await client.post(
        "/api/v1/opportunities/",
        json={"title": "Opp1", "value": 10000.0, "stage": "prospecting"},
    )
    await client.post(
        "/api/v1/opportunities/",
        json={"title": "Opp2", "value": 5000.0, "stage": "closed_won"},
    )

    response = await client.get("/api/v1/dashboard/")
    assert response.status_code == 200
    data = response.json()

    assert data["leads"]["total"] == 2
    assert data["leads"]["new"] == 1
    assert data["leads"]["qualified"] == 1
    assert data["opportunities"]["total"] == 2
    assert data["opportunities"]["pipeline_value"] == 10000.0
    assert data["opportunities"]["closed_won_value"] == 5000.0
    assert len(data["recent_leads"]) == 2
