from pathlib import Path
import pandas as pd

DATA = Path(__file__).resolve().parents[1] / "data"
DATA.mkdir(exist_ok=True)

bookings = [
    # guest_name, email, check_in, check_out, room_type, opted_out
    ("Jane Miller", "jane.miller@example.com", "2026-03-10", "2026-03-13", "double", "no"),
    ("Sam Okoye", "sam.okoye@example.com", "2025-12-14", "2025-12-17", "suite", "no"),
    ("Tom Baker", "tom.baker@example.com", "2025-07-05", "2025-07-12", "double", "no"),
    ("Thomas Baker", "tom.baker@example.com", "2024-07-06", "2024-07-13", "double", "no"),
    ("Lena Fischer", "lena.fischer@example.com", "2026-01-20", "2026-01-22", "single", "yes"),
]

pd.DataFrame(
    bookings,
    columns=["guest_name", "email", "check_in", "check_out", "room_type", "opted_out"],
).to_csv(DATA / "bookings.csv", index=False)

complaints = [
    # guest_name, email, date, complaint
    ("Jane Miller", "jane.miller@example.com", "2026-03-15", "noise from construction", "no"),
    ("Sam Okoye", "sam.okoye@example.com", "2025-12-18", "dirty room", "no"),
    ("Tom Baker", "tom.baker@example.com", "2025-07-10", "noisy neighbors", "yes"),
    ("Thomas Baker", "tom.baker@example.com", "2024-07-11", "noisy neighbors", "yes"),
    ("Lena Fischer", "lena.fischer@example.com", "2026-01-25", "poor service", "no"),
    ("Kate Johnson", "kate.johnson@example.com", "2026-03-15", "slow internet", "yes"),
]
pd.DataFrame(
    complaints,
    columns=["guest_name", "email", "date", "complaint", "replied"],
).to_csv(DATA / "complaints.csv", index=False)

print ("Wrote complaints.csv to", DATA)
# TODO: searches.csv  — guest_name, email, date, room_type, nights, booked

searches = [
    ("Kate Johnson", "kate.johnson@example.com", "2026-03-10", "double", 3, "yes"),
    ("Justin Lee", "justin.lee@example.com", "2025-12-14", "suite", 3, "yes"),
    ("Lamelo Ball", "lamelo.ball@example.com", "2026-01-20", "single", 2, "no"),
    ("Yexel Lopez", "yexel.lopez@example.com", "2026-03-10", "double", 3, "no"),
    ("Maria Garcia", "maria.garcia@example.com", "2025-07-05", "double", 3, "yes"),

]
pd.DataFrame(
    searches,
    columns=["guest_name", "email", "date", "room_type", "nights", "booked"],
).to_csv(DATA / "searches.csv", index=False)

print("Wrote searches.csv to", DATA)

print("Wrote CSVs to", DATA)