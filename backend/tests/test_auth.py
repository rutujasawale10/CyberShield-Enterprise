import pytest
from app.auth import hash_password, verify_password, create_access_token

def test_password_hashing():
    raw_pwd = "AdminPassword123!"
    hashed = hash_password(raw_pwd)
    assert hashed != raw_pwd
    assert verify_password(raw_pwd, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_flow():
    payload = {"sub": "test@cybershield.com", "role": "Admin"}
    token = create_access_token(payload)
    assert isinstance(token, str)
    assert len(token) > 20
