import requests
import sys

BASE_URL = "http://localhost:8000"

def test_integration():
    print("Starting integration verification...")
    
    # 1. Test Profile (Should fail - Unauthorized)
    print("\n[1] Testing Protected Endpoint (Profile) without token...")
    resp = requests.get(f"{BASE_URL}/auth/me/")
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.json()}")
    if resp.status_code != 401:
        print("FAILED: Expected 401 Unauthorized")
    else:
        print("PASSED")

    # 2. Test Login (requires a user in DB, but we test the structure)
    print("\n[2] Testing Login Structure...")
    login_data = {"email": "test@example.com", "password": "password123"}
    resp = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.json()}")
    
    # Check standardization
    data = resp.json()
    if all(key in data for key in ['success', 'message', 'data', 'errors']):
        print("PASSED: Response format is standardized")
    else:
        print("FAILED: Response format not standardized")

    print("\nVerification script complete. Manual testing in browser recommended for cookie/session validation.")

if __name__ == "__main__":
    test_integration()
