import pytest
from fastapi.testclient import TestClient

import backend.app.main as main

# DATABASE_URL (a throwaway SQLite file) is set once in conftest.py, before this module
# is even imported — see its docstring for why that matters.


@pytest.fixture()
def client():
    with TestClient(main.app) as c:
        yield c


def _register_and_login(client, slug):
    client.post(
        "/auth/register-hotel",
        json={
            "hotel_name": slug.title(),
            "hotel_slug": slug,
            "owner_email": f"owner@{slug}.com",
            "owner_password": "hunter2",
        },
    )
    login = client.post("/auth/login", data={"username": f"owner@{slug}.com", "password": "hunter2"})
    token = login.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_and_list_room(client):
    headers = _register_and_login(client, "alpha")
    created = client.post("/rooms", json={"number": "101", "room_type": "double"}, headers=headers)
    assert created.status_code == 201

    rooms = client.get("/rooms", headers=headers)
    assert [r["number"] for r in rooms.json()] == ["101"]


def test_duplicate_room_number_in_same_hotel_is_rejected(client):
    headers = _register_and_login(client, "beta")
    client.post("/rooms", json={"number": "101", "room_type": "double"}, headers=headers)
    dup = client.post("/rooms", json={"number": "101", "room_type": "suite"}, headers=headers)
    assert dup.status_code == 400


def test_reservation_rejects_double_booking(client):
    headers = _register_and_login(client, "gamma")
    room = client.post("/rooms", json={"number": "1", "room_type": "single"}, headers=headers).json()
    guest = client.post(
        "/guests", json={"name": "Jane Miller", "email": "jane@example.com"}, headers=headers
    ).json()

    first = client.post(
        "/reservations",
        json={"guest_id": guest["id"], "room_id": room["id"], "check_in": "2027-01-10", "check_out": "2027-01-15"},
        headers=headers,
    )
    assert first.status_code == 201

    # Overlaps the first reservation's range -> rejected
    overlapping = client.post(
        "/reservations",
        json={"guest_id": guest["id"], "room_id": room["id"], "check_in": "2027-01-12", "check_out": "2027-01-20"},
        headers=headers,
    )
    assert overlapping.status_code == 409

    # Cancel, then the same overlapping range should now be allowed
    client.post(f"/reservations/{first.json()['id']}/cancel", headers=headers)
    now_allowed = client.post(
        "/reservations",
        json={"guest_id": guest["id"], "room_id": room["id"], "check_in": "2027-01-12", "check_out": "2027-01-20"},
        headers=headers,
    )
    assert now_allowed.status_code == 201


def test_reservation_check_out_before_check_in_is_rejected(client):
    headers = _register_and_login(client, "delta")
    room = client.post("/rooms", json={"number": "1", "room_type": "single"}, headers=headers).json()
    guest = client.post(
        "/guests", json={"name": "Sam Okoye", "email": "sam@example.com"}, headers=headers
    ).json()
    resp = client.post(
        "/reservations",
        json={"guest_id": guest["id"], "room_id": room["id"], "check_in": "2027-02-10", "check_out": "2027-02-01"},
        headers=headers,
    )
    assert resp.status_code == 400


def test_one_hotel_cannot_see_or_reference_another_hotels_data(client):
    headers_a = _register_and_login(client, "hotel-a")
    headers_b = _register_and_login(client, "hotel-b")

    room_a = client.post("/rooms", json={"number": "1", "room_type": "single"}, headers=headers_a).json()
    guest_a = client.post(
        "/guests", json={"name": "A Guest", "email": "a-guest@example.com"}, headers=headers_a
    ).json()

    # Hotel B's room/guest lists must never include hotel A's rows.
    assert client.get("/rooms", headers=headers_b).json() == []
    assert client.get("/guests", headers=headers_b).json() == []

    # Hotel B trying to book hotel A's room/guest must fail as "not found", not succeed.
    cross_tenant = client.post(
        "/reservations",
        json={
            "guest_id": guest_a["id"],
            "room_id": room_a["id"],
            "check_in": "2027-03-01",
            "check_out": "2027-03-05",
        },
        headers=headers_b,
    )
    assert cross_tenant.status_code == 404
