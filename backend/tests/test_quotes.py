"""Tests for Quote API endpoints."""

import pytest


@pytest.mark.asyncio
async def test_create_quote_with_opportunity(client):
    # First create an opportunity
    opp_resp = await client.post(
        "/api/v1/opportunities/",
        json={"title": "Quote Opp", "value": 10000.0},
    )
    opp_id = opp_resp.json()["id"]

    response = await client.post(
        "/api/v1/quotes/",
        json={
            "opportunity_id": opp_id,
            "items": [{"name": "Service A", "price": 5000}, {"name": "Service B", "price": 5000}],
            "total": 10000.0,
            "status": "draft",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["total"] == 10000.0
    assert data["status"] == "draft"
    assert data["opportunity_id"] == opp_id
    assert data["items"] == [{"name": "Service A", "price": 5000}, {"name": "Service B", "price": 5000}]


@pytest.mark.asyncio
async def test_list_quotes(client):
    opp_resp = await client.post(
        "/api/v1/opportunities/",
        json={"title": "List Opp"},
    )
    opp_id = opp_resp.json()["id"]

    await client.post(
        "/api/v1/quotes/",
        json={"opportunity_id": opp_id, "status": "draft"},
    )
    await client.post(
        "/api/v1/quotes/",
        json={"opportunity_id": opp_id, "status": "sent"},
    )

    response = await client.get("/api/v1/quotes/")
    assert response.status_code == 200
    assert response.json()["total"] == 2


@pytest.mark.asyncio
async def test_filter_quotes_by_status(client):
    opp_resp = await client.post(
        "/api/v1/opportunities/",
        json={"title": "Filter Opp"},
    )
    opp_id = opp_resp.json()["id"]

    await client.post(
        "/api/v1/quotes/",
        json={"opportunity_id": opp_id, "status": "draft"},
    )
    await client.post(
        "/api/v1/quotes/",
        json={"opportunity_id": opp_id, "status": "sent"},
    )

    response = await client.get("/api/v1/quotes/?status=sent")
    assert response.json()["total"] == 1


@pytest.mark.asyncio
async def test_get_quote(client):
    opp_resp = await client.post(
        "/api/v1/opportunities/",
        json={"title": "Get Opp"},
    )
    opp_id = opp_resp.json()["id"]

    create_resp = await client.post(
        "/api/v1/quotes/",
        json={"opportunity_id": opp_id},
    )
    quote_id = create_resp.json()["id"]

    response = await client.get(f"/api/v1/quotes/{quote_id}")
    assert response.status_code == 200
    assert response.json()["id"] == quote_id


@pytest.mark.asyncio
async def test_update_quote(client):
    opp_resp = await client.post(
        "/api/v1/opportunities/",
        json={"title": "Update Opp"},
    )
    opp_id = opp_resp.json()["id"]

    create_resp = await client.post(
        "/api/v1/quotes/",
        json={"opportunity_id": opp_id, "status": "draft"},
    )
    quote_id = create_resp.json()["id"]

    response = await client.patch(
        f"/api/v1/quotes/{quote_id}",
        json={"status": "sent", "total": 15000.0},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "sent"
    assert response.json()["total"] == 15000.0


@pytest.mark.asyncio
async def test_delete_quote(client):
    opp_resp = await client.post(
        "/api/v1/opportunities/",
        json={"title": "Delete Opp"},
    )
    opp_id = opp_resp.json()["id"]

    create_resp = await client.post(
        "/api/v1/quotes/",
        json={"opportunity_id": opp_id},
    )
    quote_id = create_resp.json()["id"]

    response = await client.delete(f"/api/v1/quotes/{quote_id}")
    assert response.status_code == 204

    get_response = await client.get(f"/api/v1/quotes/{quote_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_quote_not_found(client):
    response = await client.get("/api/v1/quotes/nonexistent")
    assert response.status_code == 404
