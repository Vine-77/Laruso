import pytest
from fastapi.testclient import TestClient

import backend.app.main as main

# DATABASE_URL (a throwaway SQLite file) is set once in conftest.py, before this module
# is even imported — see its docstring for why that matters.


@pytest.fixture()
def client():
    with TestClient(main.app) as c:  # the `with` triggers the startup event (creates tables)
        yield c


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_register_login_and_me(client):
    register = client.post(
        "/auth/register-hotel",
        json={
            "hotel_name": "Sunset Inn",
            "hotel_slug": "sunset-inn",
            "owner_email": "owner@sunsetinn.com",
            "owner_password": "hunter2",
        },
    )
    assert register.status_code == 201
    assert register.json()["role"] == "owner"

    login = client.post("/auth/login", data={"username": "owner@sunsetinn.com", "password": "hunter2"})
    assert login.status_code == 200
    token = login.json()["access_token"]

    me = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == "owner@sunsetinn.com"
    assert me.json()["hotel_id"] == register.json()["hotel_id"]


def test_duplicate_hotel_slug_is_rejected(client):
    payload = {"hotel_name": "A", "hotel_slug": "dup-slug", "owner_email": "a@example.com", "owner_password": "x"}
    assert client.post("/auth/register-hotel", json=payload).status_code == 201
    payload["owner_email"] = "someone-else@example.com"  # different email, same slug
    assert client.post("/auth/register-hotel", json=payload).status_code == 400


def test_bad_login_is_rejected(client):
    resp = client.post("/auth/login", data={"username": "nobody@example.com", "password": "x"})
    assert resp.status_code == 401


def test_bad_token_is_rejected(client):
    resp = client.get("/auth/me", headers={"Authorization": "Bearer garbage"})
    assert resp.status_code == 401
