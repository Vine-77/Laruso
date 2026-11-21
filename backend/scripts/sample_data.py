from pathlib import Path
import pandas as pd

# repo_root/backend/scripts/sample_data.py -> parents[2] is the repo root.
DATA = Path(__file__).resolve().parents[2] / "sandbox" / "fixtures"
DATA.mkdir(parents=True, exist_ok=True)

bookings = [
    # hotel_id, guest_name, email, check_in, check_out, room_type, opted_out
    ("H001", "Jane Miller", "jane.miller@example.com", "2026-03-10", "2026-03-13", "double", "no"),
    ("H001", "Sam Okoye", "sam.okoye@example.com", "2025-12-14", "2025-12-17", "suite", "no"),
    ("H001", "Tom Baker", "tom.baker@example.com", "2025-07-05", "2025-07-12", "double", "no"),
    ("H001", "Thomas Baker", "tom.baker@example.com", "2024-07-06", "2024-07-13", "double", "no"),
    ("H001", "Lena Fischer", "lena.fischer@example.com", "2026-01-20", "2026-01-22", "single", "yes"),
    # Second hotel: same email as an H001 guest, but a different stay and a different relationship
    ("H002", "Jane Miller", "jane.miller@example.com", "2025-06-01", "2025-06-04", "suite", "no"),
    ("H002", "Omar Haddad", "omar.haddad@example.com", "2026-02-10", "2026-02-14", "double", "no"),
]

pd.DataFrame(
    bookings,
    columns=["hotel_id", "guest_name", "email", "check_in", "check_out", "room_type", "opted_out"],
).to_csv(DATA / "bookings.csv", index=False)

complaints = [
    # hotel_id, guest_name, email, date, complaint, replied
    ("H001", "Jane Miller", "jane.miller@example.com", "2026-03-15", "noise from construction", "no"),
    ("H001", "Sam Okoye", "sam.okoye@example.com", "2025-12-18", "dirty room", "no"),
    ("H001", "Tom Baker", "tom.baker@example.com", "2025-07-10", "noisy neighbors", "yes"),
    ("H001", "Thomas Baker", "tom.baker@example.com", "2024-07-11", "noisy neighbors", "yes"),
    ("H001", "Lena Fischer", "lena.fischer@example.com", "2026-01-25", "poor service", "no"),
    ("H001", "Kate Johnson", "kate.johnson@example.com", "2026-03-15", "slow internet", "yes"),
    # H002: Jane has no open complaint here, unlike at H001
    ("H002", "Omar Haddad", "omar.haddad@example.com", "2026-02-15", "late check-in", "no"),
]
pd.DataFrame(
    complaints,
    columns=["hotel_id", "guest_name", "email", "date", "complaint", "replied"],
).to_csv(DATA / "complaints.csv", index=False)

print("Wrote complaints.csv to", DATA)

searches = [
    # hotel_id, guest_name, email, date, room_type, nights, booked
    ("H001", "Kate Johnson", "kate.johnson@example.com", "2026-03-10", "double", 3, "yes"),
    ("H001", "Justin Lee", "justin.lee@example.com", "2025-12-14", "suite", 3, "yes"),
    ("H001", "Lamelo Ball", "lamelo.ball@example.com", "2026-01-20", "single", 2, "no"),
    ("H001", "Yexel Lopez", "yexel.lopez@example.com", "2026-03-10", "double", 3, "no"),
    ("H001", "Maria Garcia", "maria.garcia@example.com", "2025-07-05", "double", 3, "yes"),
    ("H002", "Priya Nair", "priya.nair@example.com", "2026-03-01", "suite", 2, "no"),
]
pd.DataFrame(
    searches,
    columns=["hotel_id", "guest_name", "email", "date", "room_type", "nights", "booked"],
).to_csv(DATA / "searches.csv", index=False)

print("Wrote searches.csv to", DATA)
print("Wrote CSVs to", DATA)