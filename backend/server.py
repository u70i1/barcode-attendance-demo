from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from datetime import datetime, date
import csv
from pathlib import Path
from typing import Dict, Optional, List

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STUDENTS_CSV = Path("mock/attendance.csv")
LOG_CSV = Path("mock/scan_log.csv")


class ScanRequest(BaseModel):
    nisn: str


class ScanResponse(BaseModel):
    status: str
    name: Optional[str] = None
    class_name: Optional[str] = None
    nisn: Optional[str] = None
    timestamp: Optional[str] = None


_students_cache: Optional[Dict[str, dict]] = None


def load_students() -> Dict[str, dict]:
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


@app.post("/scan", response_model=ScanResponse)
async def scan(payload: ScanRequest):
    # 1. Load students (cached)
    try:
        students = load_students()
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))

    # 2. Check if student exists
    student = students.get(payload.nisn)
    if student is None:
        raise HTTPException(
            status_code=404, detail={"message": "not_found", "nisn": payload.nisn}
        )

    # 3. Check if already scanned today
    # today_scanned = get_today_logs()
    # if payload.nisn in today_scanned:
    #      raise HTTPException(
    #         status_code=409, detail={"message": "already_exists", "nisn": payload.nisn}
    #     )

    # 4. Log the scan
    log_scan(student)

    # 5. Return success
    return ScanResponse(
        status="success",
        name=student.get("name"),
        class_name=student.get("class"),
        nisn=student.get("nisn"),
        timestamp=datetime.now().isoformat(timespec="seconds"),
    )


app.mount("/photos", StaticFiles(directory="photos"), name="photos")
