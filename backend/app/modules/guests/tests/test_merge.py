from datetime import date

from backend.app.modules.guests.merge import DEFAULT_OPTED_OUT, build_guests


def by_guest(guests):
    return {(g["hotel_id"], g["email"]): g for g in guests}


def test_every_person_appears_once():
    guests = build_guests()
    keys = [(g["hotel_id"], g["email"]) for g in guests]
    assert len(keys) == len(set(keys))
    emails = [g["email"] for g in guests]
    # includes people who only searched or only complained
    assert "lamelo.ball@example.com" in emails
    assert "kate.johnson@example.com" in emails


def test_duplicate_tom_is_merged_into_one_profile():
    guests = by_guest(build_guests())
    keys = [(g["hotel_id"], g["email"]) for g in build_guests()]
    assert keys.count(("H001", "tom.baker@example.com")) == 1
    assert guests[("H001", "tom.baker@example.com")]["last_stay"] == date(2025, 7, 12)


def test_jane_has_an_open_complaint():
    jane = by_guest(build_guests())[("H001", "jane.miller@example.com")]
    assert jane["open_complaint"] is True
    assert jane["opted_out"] is False
    assert jane["last_stay"] == date(2026, 3, 13)


def test_same_email_at_two_hotels_stays_separate():
    guests = by_guest(build_guests())
    assert guests[("H001", "jane.miller@example.com")]["open_complaint"] is True
    assert guests[("H002", "jane.miller@example.com")]["open_complaint"] is False


def test_lena_opted_out():
    assert by_guest(build_guests())[("H001", "lena.fischer@example.com")]["opted_out"] is True


def test_tom_complaint_was_replied_to():
    assert by_guest(build_guests())[("H001", "tom.baker@example.com")]["open_complaint"] is False


def test_lamelo_never_stayed_and_has_unfinished_search():
    lamelo = by_guest(build_guests())[("H001", "lamelo.ball@example.com")]
    assert lamelo["last_stay"] is None
    assert lamelo["unfinished_search"] is True


def test_guest_with_no_consent_info_uses_the_default():
    lamelo = by_guest(build_guests())[("H001", "lamelo.ball@example.com")]
    assert lamelo["opted_out"] is DEFAULT_OPTED_OUT