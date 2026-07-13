import csv
from pathlib import Path
from typing import Dict, Optional, List
from datetime import date, datetime

STUDENTS_CSV = Path("mock/attendance.csv")
LOG_CSV = Path("mock/scan_log.csv")


_students_cache: Optional[Dict[str, dict]] = None


def load_students() -> Dict[str, dict]:
    """Load students from cache or `STUDENTS_CSV`

    Raises:
        FileNotFoundError: If STUDENTS_CSV not found

    Returns:
        Dict[str, dict]: '<NISN>': {<student's identity}
    """
    global _students_cache
    if _students_cache is not None:
        return _students_cache

    if not STUDENTS_CSV.exists():
        raise FileNotFoundError(f"Students CSV not found at {STUDENTS_CSV}")

    students = {}
    with open(STUDENTS_CSV, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            nisn = row.get("nisn")
            if nisn:
                students[nisn] = row
    _students_cache = students
    print(students)
    return students


def get_today_logs() -> List[str]:
    if not LOG_CSV.exists():
        return []

    today = date.today()
    scanned_nisns = []
    with open(LOG_CSV, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                log_date = datetime.fromisoformat(row["timestamp"]).date()
                if log_date == today:
                    scanned_nisns.append(row["nisn"])
            except (ValueError, KeyError):
                continue
    return scanned_nisns


def log_scan(student: dict):
    timestamp = datetime.now().isoformat(timespec="seconds")
    file_exists = LOG_CSV.exists()

    LOG_CSV.parent.mkdir(parents=True, exist_ok=True)

    with open(LOG_CSV, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["name", "class", "nisn", "timestamp"])
        writer.writerow(
            [
                student.get("name", ""),
                student.get("class", ""),
                student.get("nisn", ""),
                timestamp,
            ]
        )
