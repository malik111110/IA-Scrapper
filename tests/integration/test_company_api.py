import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_company_profile(client: AsyncClient):
    response = await client.post(
        "/api/v1/company/",
        json={
            "name": "Integration Test LLC",
            "description": "Integration testing profile",
            "services": ["Testing", "Validating"],
            "contact_email": "test@integration.com"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Integration Test LLC"
    assert data["contact_email"] == "test@integration.com"
    assert "id" in data

@pytest.mark.asyncio
async def test_get_company_profiles(client: AsyncClient):
    # Create one first
    await client.post(
        "/api/v1/company/",
        json={"name": "Company 1", "contact_email": "c1@test.com"}
    )
    
    response = await client.get("/api/v1/company/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Company 1"

@pytest.mark.asyncio
async def test_update_company_profile(client: AsyncClient):
    # Create
    create_res = await client.post(
        "/api/v1/company/",
        json={"name": "Old Name", "contact_email": "old@test.com"}
    )
    profile_id = create_res.json()["id"]
    
    # Update
    update_res = await client.put(
        f"/api/v1/company/{profile_id}",
        json={"name": "New Name"}
    )
    assert update_res.status_code == 200
    assert update_res.json()["name"] == "New Name"
    assert update_res.json()["contact_email"] == "old@test.com"

@pytest.mark.asyncio
async def test_delete_company_profile(client: AsyncClient):
    # Create
    create_res = await client.post(
        "/api/v1/company/",
        json={"name": "To Delete", "contact_email": "delete@test.com"}
    )
    profile_id = create_res.json()["id"]
    
    # Delete
    delete_res = await client.delete(f"/api/v1/company/{profile_id}")
    assert delete_res.status_code == 200
    
    # Verify deleted
    get_res = await client.get(f"/api/v1/company/{profile_id}")
    assert get_res.status_code == 404
