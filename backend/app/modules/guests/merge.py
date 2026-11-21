from datetime import date
from pathlib import Path

import pandas as pd

DATA = Path(__file__).resolve().parents[4] / "sandbox" / "fixtures"

# No booking row means no consent info, so treat the guest as opted out (safe default).
DEFAULT_OPTED_OUT = True


def _load(data_dir: Path) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    bookings = pd.read_csv(data_dir / "bookings.csv")
    complaints = pd.read_csv(data_dir / "complaints.csv")
    searches = pd.read_csv(data_dir / "searches.csv")

    for df in (bookings, complaints, searches):
        df["email"] = df["email"].str.strip().str.lower()
    return bookings, complaints, searches


def build_guests(data_dir: Path = DATA) -> list[dict]:
    """One dict per guest, with keys: hotel_id, email, name, last_stay, opted_out, open_complaint, unfinished_search"""
    bookings, complaints, searches = _load(data_dir)

    # Sorted by check_out so "last" is the latest stay.
    by_booking = (
        bookings.sort_values("check_out")
        .groupby(["hotel_id", "email"], as_index=False)
        .agg(
            booking_name=("guest_name", "last"),
            last_stay=("check_out", "last"),
            opted_out=("opted_out", lambda s: (s == "yes").any()),
        )
    )

    by_complaint = complaints.groupby(["hotel_id", "email"], as_index=False).agg(
        complaint_name=("guest_name", "first"),
        open_complaint=("replied", lambda s: (s == "no").any()),
    )

    by_search = searches.groupby(["hotel_id", "email"], as_index=False).agg(
        search_name=("guest_name", "first"),
        unfinished_search=("booked", lambda s: (s == "no").any()),
    )

    # "outer" keeps guests who appear in only one of the three tables.
    guests = (
        by_booking.merge(by_complaint, on=["hotel_id", "email"], how="outer")
        .merge(by_search, on=["hotel_id", "email"], how="outer")
    )

    guests["name"] = (
        guests["booking_name"].combine_first(guests["complaint_name"]).combine_first(guests["search_name"])
    )

    # Missing values mean the guest has no row in that table.
    guests["opted_out"] = guests["opted_out"].fillna(DEFAULT_OPTED_OUT).apply(bool)
    guests["open_complaint"] = guests["open_complaint"].fillna(False).apply(bool)
    guests["unfinished_search"] = guests["unfinished_search"].fillna(False).apply(bool)

    guests["last_stay"] = guests["last_stay"].apply(lambda v: date.fromisoformat(v) if pd.notna(v) else None)

    guests = guests.sort_values(["hotel_id", "email"]).reset_index(drop=True)
    columns = ["hotel_id", "email", "name", "last_stay", "opted_out", "open_complaint", "unfinished_search"]
    return guests[columns].to_dict("records")


if __name__ == "__main__":
    for guest in build_guests():
        print(guest)