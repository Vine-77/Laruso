from laruso.guardrails.checks import check_draft

CLEAN = "Hi Jane, we would love to welcome you back soon. Warm regards, the team."


def test_clean_draft_passes():
    assert check_draft(CLEAN, opted_out=False) == []


def test_opted_out_guest_is_flagged():
    assert any("opted out" in i for i in check_draft(CLEAN, opted_out=True))


def test_placeholder_is_flagged():
    assert check_draft("Warmly, The [Hotel Name] Team. We hope to see you soon.", False)


def test_too_short_and_too_long():
    assert check_draft("Hi", False)
    assert check_draft("a " * 600, False)


def test_price_word_is_flagged():
    issues = check_draft("Enjoy a free upgrade, we would love to see you again", False)
    assert any("free" in i for i in issues)


def test_no_false_alarm_inside_longer_words():
    assert check_draft("We hope you feel at home, and have a carefree stay.", False) == []


def test_currency_symbols_are_flagged():
    assert check_draft("Stay with us for $99 a night, we would love to see you", False)
    assert check_draft("Enjoy 20% off, we would love to see you again soon", False)


def test_currency_code_is_flagged():
    assert check_draft("The room is 80 USD per night, we would love to see you", False)


def test_room_promise_is_flagged():
    assert any("upgrade" in i for i in check_draft("We will give you an upgrade next time, see you soon", False))


def test_multiple_issues_are_all_reported():
    assert len(check_draft("[Name], enjoy a free upgrade at $50 for your stay", True)) >= 4
