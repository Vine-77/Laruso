from datetime import date
from pathlib import Path

import pandas as pd

# repo_root/backend/app/modules/guests/merge.py -> parents[4] is the repo root.
# Sample/test data lives in sandbox/fixtures, kept out of this production module on purpose
# (see PROJECT_OVERVIEW.md) so real guest data sources never get mixed up with fixtures.
DATA = Path(__file__).resolve().parents[4] / "sandbox" / "fixtures"

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

    # One row per email, summarizing all of that email's bookings at once.
    # Sorting first means the "last" row *within each group* is the latest checkout —
    # groupby preserves each group's row order from the frame it's given, so this is the
    # vectorized equivalent of ".sort_values('check_out').iloc[-1]" run separately per guest.
    by_booking = (
        bookings.sort_values("check_out")
        .groupby("email", as_index=False)
        .agg(
            booking_name=("guest_name", "last"),
            last_stay=("check_out", "last"),
            opted_out=("opted_out", lambda s: (s == "yes").any()),
        )
    )

    by_complaint = complaints.groupby("email", as_index=False).agg(
        complaint_name=("guest_name", "first"),
        open_complaint=("replied", lambda s: (s == "no").any()),
    )

    by_search = searches.groupby("email", as_index=False).agg(
        search_name=("guest_name", "first"),
        unfinished_search=("booked", lambda s: (s == "no").any()),
    )

    # how="outer" keeps every email that appears in ANY of the three tables, matching the
    # old set-union behaviour — an "inner" join would silently drop guests who, say, only
    # ever searched and never booked or complained.
    guests = (
        by_booking.merge(by_complaint, on="email", how="outer")
        .merge(by_search, on="email", how="outer")
    )

    # A guest missing from `by_booking` never stayed: prefer their booking name, falling
    # back to whichever other table actually has them. combine_first fills NaNs from the
    # next Series, left to right.
    guests["name"] = (
        guests["booking_name"].combine_first(guests["complaint_name"]).combine_first(guests["search_name"])
    )

    # Missing values here mean "no row in that table for this guest" -> apply the same
    # defaults the original code used.
    guests["opted_out"] = guests["opted_out"].fillna(DEFAULT_OPTED_OUT).apply(bool)
    guests["open_complaint"] = guests["open_complaint"].fillna(False).apply(bool)
    guests["unfinished_search"] = guests["unfinished_search"].fillna(False).apply(bool)

    # "2026-03-13" -> date(2026, 3, 13); guests with no booking keep last_stay = None.
    guests["last_stay"] = guests["last_stay"].apply(lambda v: date.fromisoformat(v) if pd.notna(v) else None)

    guests = guests.sort_values("email").reset_index(drop=True)
    columns = ["email", "name", "last_stay", "opted_out", "open_complaint", "unfinished_search"]
    return guests[columns].to_dict("records")


if __name__ == "__main__":
    for guest in build_guests():
        print(guest)
