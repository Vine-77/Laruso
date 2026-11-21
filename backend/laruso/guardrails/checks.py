import re

price_words = [
    # currency codes
    "usd", "eur", "rwf", "gbp",
    # price and cost
    "price", "prices", "pricing", "priced", "cost", "costs", "rate", "rates",
    "fee", "fees", "charge", "charges", "cheap", "cheaper", "affordable", "expensive",
    # discounts and deals
    "discount", "discounts", "discounted", "deal", "deals", "promo", "promotion",
    "promotional", "coupon", "voucher", "sale", "special offer", "half price",
    "off your stay",
    # free
    "free", "complimentary", "on the house", "no charge", "no extra cost",
    # compensation
    "refund", "refunded", "reimburse", "reimbursement", "compensate",
    "compensation", "credit", "waive", "waived",
]
# Promises about rooms that only hotel staff can make
room_words = [
    "upgrade", "upgraded", "guarantee", "guaranteed", "reserved for you",
    "best room", "sea view", "ocean view", "suite",
]

price_symbols = ["$", "€", "£", "¥", "₹", "₩", "₽", "₺", "₴", "₦", "₱", "₲", "₵", "₡", "₸", "₮", "%"]


def check_draft(draft: str, opted_out: bool) -> list[str]:
    """Return a list of issues found in the draft. Empty if no issues."""
    issues = []
    if opted_out:
        issues.append("Guest opted out of messages")
    if len(draft) < 20:
        issues.append("Draft is too short.")
    if len(draft) > 1000:
        issues.append("Draft is too long.")
    if "[" in draft and "]" in draft:
        issues.append("Draft contains placeholder characters which aren't allowed.")
    for word in price_words:
        if re.search(rf"\b{re.escape(word)}\b", draft.lower()):
            issues.append(f"Draft mentions money or a deal: '{word}'")
    for symbol in price_symbols:
        if symbol in draft:
            issues.append(f"Draft contains a currency symbol: '{symbol}'")
    for word in room_words:
        if re.search(rf"\b{re.escape(word)}\b", draft.lower()):
            issues.append(f"Draft promises or names a room benefit: '{word}'")
    return issues