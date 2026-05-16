"""Tests for Lead API endpoints."""

import pytest


@pytest.mark.asyncio
async def test_create_lead(client):
    response = await client.post(
        "/api/v1/leads/",
        json={
            "name": "John Doe",
            "email": "john@test.com",
            "company": "TestCo",
            "source": "web",
            "status": "new",
            "score": 50,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["email"] == "john@test.com"
    assert data["score"] == 50
    assert data["status"] == "new"
    assert "id" in data


@pytest.mark.asyncio
async def test_list_leads(client):
    # Create a lead first
    await client.post(
        "/api/v1/leads/",
        json={"name": "List Test", "email": "list@test.com", "score": 30},
    )
    response = await client.get("/api/v1/leads/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1


@pytest.mark.asyncio
async def test_get_lead(client):
    create_resp = await client.post(
        "/api/v1/leads/",
        json={"name": "Get Test", "email": "get@test.com", "score": 60},
    )
    lead_id = create_resp.json()["id"]

    response = await client.get(f"/api/v1/leads/{lead_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Get Test"


@pytest.mark.asyncio
async def test_get_lead_not_found(client):
    response = await client.get("/api/v1/leads/nonexistent-id")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_lead(client):
    create_resp = await client.post(
        "/api/v1/leads/",
        json={"name": "Update Test", "email": "update@test.com", "score": 40},
    )
    lead_id = create_resp.json()["id"]

    response = await client.patch(
        f"/api/v1/leads/{lead_id}",
        json={"score": 90, "status": "qualified"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 90
    assert data["status"] == "qualified"


@pytest.mark.asyncio
async def test_delete_lead(client):
    create_resp = await client.post(
        "/api/v1/leads/",
        json={"name": "Delete Test", "email": "delete@test.com", "score": 10},
    )
    lead_id = create_resp.json()["id"]

    response = await client.delete(f"/api/v1/leads/{lead_id}")
    assert response.status_code == 204

    get_response = await client.get(f"/api/v1/leads/{lead_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_search_leads(client):
    await client.post(
        "/api/v1/leads/",
        json={"name": "Alice", "email": "alice@test.com", "company": "Alpha Inc", "score": 80},
    )
    await client.post(
        "/api/v1/leads/",
        json={"name": "Bob", "email": "bob@test.com", "company": "Beta LLC", "score": 30},
    )

    # Search by name
    resp = await client.get("/api/v1/leads/?search=Alice")
    assert resp.json()["total"] == 1

    # Search by company
    resp = await client.get("/api/v1/leads/?search=Beta")
    assert resp.json()["total"] == 1

    # Filter by score
    resp = await client.get("/api/v1/leads/?score_min=50")
    assert resp.json()["total"] == 1


@pytest.mark.asyncio
async def test_bulk_delete(client):
    r1 = await client.post(
        "/api/v1/leads/",
        json={"name": "Bulk1", "email": "bulk1@test.com"},
    )
    r2 = await client.post(
        "/api/v1/leads/",
        json={"name": "Bulk2", "email": "bulk2@test.com"},
    )
    ids = [r1.json()["id"], r2.json()["id"]]

    response = await client.post(
        "/api/v1/leads/bulk-delete",
        json={"ids": ids},
    )
    assert response.status_code == 204

    list_resp = await client.get("/api/v1/leads/")
    assert list_resp.json()["total"] == 0


@pytest.mark.asyncio
async def test_bulk_update_status(client):
    r1 = await client.post(
        "/api/v1/leads/",
        json={"name": "BulkStatus1", "email": "bs1@test.com", "status": "new"},
    )
    r2 = await client.post(
        "/api/v1/leads/",
        json={"name": "BulkStatus2", "email": "bs2@test.com", "status": "new"},
    )
    ids = [r1.json()["id"], r2.json()["id"]]

    response = await client.post(
        "/api/v1/leads/bulk-status",
        json={"ids": ids, "status": "qualified"},
    )
    assert response.status_code == 200
    assert response.json()["updated"] == 2

    # Verify
    for lead_id in ids:
        resp = await client.get(f"/api/v1/leads/{lead_id}")
        assert resp.json()["status"] == "qualified"


@pytest.mark.asyncio
async def test_convert_lead_to_opportunity(client):
    create_resp = await client.post(
        "/api/v1/leads/",
        json={"name": "Convert Me", "email": "convert@test.com", "company": "ConvertCo"},
    )
    lead_id = create_resp.json()["id"]

    response = await client.post(f"/api/v1/leads/{lead_id}/convert")
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Convert Me — ConvertCo"
    assert data["stage"] == "prospecting"
    assert data["lead_id"] == lead_id

    # Lead status should be qualified
    lead_resp = await client.get(f"/api/v1/leads/{lead_id}")
    assert lead_resp.json()["status"] == "qualified"
