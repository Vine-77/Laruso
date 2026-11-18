from pathlib import Path
import pandas as pd

DATA = Path(__file__).resolve().parents[2] / "data"

bookings = pd.read_csv(DATA / "bookings.csv")
complaints = pd.read_csv(DATA / "complaints.csv")
searches = pd.read_csv(DATA / "searches.csv")

# Make emails comparable: no stray spaces, all lowercase
for df in (bookings, complaints, searches):
    df["email"] = df["email"].str.strip().str.lower()

guests = bookings.groupby("email").agg(
    name=("guest_name", "first"),
    stays=("check_in", "count"),
    last_stay=("check_out", "max"),
).reset_index()

print(guests)
