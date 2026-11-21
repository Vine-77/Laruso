from datetime import date

from laruso.data.merge import build_guests
from laruso.scoring.rules import score_guest


def by_email(guests):
    return {g["email"]: g for g in guests}


def test_every_person_appears_once():
    guests = build_guests()
    emails = [g["email"] for g in guests]
    assert len(emails) == len(set(emails))
    # includes people who only searched or only complained
    assert "lamelo.ball@example.com" in emails
    assert "kate.johnson@example.com" in emails


def test_duplicate_tom_is_merged_into_one_profile():
    guests = by_email(build_guests())
    assert [g["email"] for g in build_guests()].count("tom.baker@example.com") == 1
    assert guests["tom.baker@example.com"]["last_stay"] == date(2025, 7, 12)


def test_jane_has_an_open_complaint():
    jane = by_email(build_guests())["jane.miller@example.com"]
    assert jane["open_complaint"] is True
    assert jane["opted_out"] is False
    assert jane["last_stay"] == date(2026, 3, 13)


def test_lena_opted_out():
    assert by_email(build_guests())["lena.fischer@example.com"]["opted_out"] is True


def test_tom_complaint_was_replied_to():
    assert by_email(build_guests())["tom.baker@example.com"]["open_complaint"] is False


def test_lamelo_never_stayed_and_has_unfinished_search():
    lamelo = by_email(build_guests())["lamelo.ball@example.com"]
    assert lamelo["last_stay"] is None
    assert lamelo["unfinished_search"] is True


def test_guest_with_no_consent_info_uses_the_default():
    from laruso.data.merge import DEFAULT_OPTED_OUT
    assert by_email(build_guests())["lamelo.ball@example.com"]["opted_out"] is DEFAULT_OPTED_OUT


def test_merged_guests_work_with_scoring():
    today = date(2026, 11, 18)
    guests = by_email(build_guests())
    assert score_guest(guests["jane.miller@example.com"], today) == ["Guest has an open complaint"]
    assert score_guest(guests["lena.fischer@example.com"], today) == []
