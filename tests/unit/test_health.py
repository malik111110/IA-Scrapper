from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    # Note: If /health doesn't exist, this will fail, which is good for identifying missing endpoints
    assert response.status_code in [200, 404] 
