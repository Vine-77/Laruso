from datetime import date
from pathlib import Path

import pandas as pd

DATA = Path(__file__).resolve().parents[2] / "data"

# If a guest has no booking row we have no consent information for them.
# True = treat them as opted out (safe). Change to False to contact them anyway.
DEFAULT_OPTED_OUT = True


def _load(data_dir: Path) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    bookings = pd.read_csv(data_dir / "bookings.csv")
    complaints = pd.read_csv(data_dir / "complaints.csv")
    searches = pd.read_csv(data_dir / "searches.csv")

    # Make emails comparable: no stray spaces, all lowercase
    for df in (bookings, complaints, searches):
        df["email"] = df["email"].str.strip().str.lower()
    return bookings, complaints, searches


def build_guests(data_dir: Path = DATA) -> list[dict]:
    """One dict per guest, with keys: email, name, last_stay, opted_out, open_complaint, unfinished_search"""
    bookings, complaints, searches = _load(data_dir)

    # Everyone who appears in any of the three files, once each
    emails = set(bookings["email"]) | set(complaints["email"]) | set(searches["email"])

    guests = []
    for email in sorted(emails):
        their_bookings = bookings[bookings["email"] == email]
        their_complaints = complaints[complaints["email"] == email]
        their_searches = searches[searches["email"] == email]

        if len(their_bookings) > 0:
            latest = their_bookings.sort_values("check_out").iloc[-1]
            name = latest["guest_name"]
            last_stay = date.fromisoformat(latest["check_out"])
            opted_out = (their_bookings["opted_out"] == "yes").any()
        else:
            # Never stayed: take the name from whichever file has them
            name = pd.concat([their_complaints, their_searches]).iloc[0]["guest_name"]
            last_stay = None
            opted_out = DEFAULT_OPTED_OUT

        guests.append({
            "email": email,
            "name": name,
            "last_stay": last_stay,
            "opted_out": bool(opted_out),
            "open_complaint": bool((their_complaints["replied"] == "no").any()),
            "unfinished_search": bool((their_searches["booked"] == "no").any()),
        })
    return guests


if __name__ == "__main__":
    for guest in build_guests():
        print(guest)
