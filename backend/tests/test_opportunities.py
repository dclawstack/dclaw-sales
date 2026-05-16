"""Tests for Opportunity API endpoints."""

import pytest


@pytest.mark.asyncio
async def test_create_opportunity(client):
    response = await client.post(
        "/api/v1/opportunities/",
        json={
            "title": "Big Deal",
            "value": 50000.0,
            "stage": "prospecting",
            "probability": 20,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Big Deal"
    assert data["value"] == 50000.0
    assert data["stage"] == "prospecting"
    assert data["probability"] == 20


@pytest.mark.asyncio
async def test_list_opportunities(client):
    await client.post(
        "/api/v1/opportunities/",
        json={"title": "Op1", "stage": "prospecting"},
    )
    await client.post(
        "/api/v1/opportunities/",
        json={"title": "Op2", "stage": "negotiation"},
    )
    response = await client.get("/api/v1/opportunities/")
    assert response.status_code == 200
    assert response.json()["total"] == 2


@pytest.mark.asyncio
async def test_filter_opportunities_by_stage(client):
    await client.post(
        "/api/v1/opportunities/",
        json={"title": "Stage1", "stage": "prospecting"},
    )
    await client.post(
        "/api/v1/opportunities/",
        json={"title": "Stage2", "stage": "negotiation"},
    )
    response = await client.get("/api/v1/opportunities/?stage=prospecting")
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["title"] == "Stage1"


@pytest.mark.asyncio
async def test_get_opportunity(client):
    create_resp = await client.post(
        "/api/v1/opportunities/",
        json={"title": "Get Opp"},
    )
    opp_id = create_resp.json()["id"]
    response = await client.get(f"/api/v1/opportunities/{opp_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Get Opp"


@pytest.mark.asyncio
async def test_update_opportunity(client):
    create_resp = await client.post(
        "/api/v1/opportunities/",
        json={"title": "Update Opp", "value": 1000.0},
    )
    opp_id = create_resp.json()["id"]
    response = await client.patch(
        f"/api/v1/opportunities/{opp_id}",
        json={"value": 5000.0, "stage": "proposal"},
    )
    assert response.status_code == 200
    assert response.json()["value"] == 5000.0
    assert response.json()["stage"] == "proposal"


@pytest.mark.asyncio
async def test_delete_opportunity(client):
    create_resp = await client.post(
        "/api/v1/opportunities/",
        json={"title": "Delete Opp"},
    )
    opp_id = create_resp.json()["id"]
    response = await client.delete(f"/api/v1/opportunities/{opp_id}")
    assert response.status_code == 204

    get_response = await client.get(f"/api/v1/opportunities/{opp_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_update_opportunity_stage(client):
    create_resp = await client.post(
        "/api/v1/opportunities/",
        json={"title": "Stage Opp", "stage": "prospecting"},
    )
    opp_id = create_resp.json()["id"]
    response = await client.patch(
        f"/api/v1/opportunities/{opp_id}/stage",
        json={"stage": "closed_won"},
    )
    assert response.status_code == 200
    assert response.json()["stage"] == "closed_won"


@pytest.mark.asyncio
async def test_opportunity_not_found(client):
    response = await client.get("/api/v1/opportunities/nonexistent")
    assert response.status_code == 404
