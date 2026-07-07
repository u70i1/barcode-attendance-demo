from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import csv

app = FastAPI()

# Only for demo purposes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

STUDENTS_CSV = "mock/attendance.csv"
LOG_CSV = "mock/scan_log.csv"


class ScanRequest(BaseModel):
    nisn: str


def find_student(nisn: str):
    with open(STUDENTS_CSV, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["nisn"] == nisn:
                return row
    return None


def log_scan(student: dict):
    timestamp = datetime.now().isoformat(timespec="seconds")
    file_exists = False
    try:
        with open(LOG_CSV, "r"):
            file_exists = True
    except FileNotFoundError:
        pass

    with open(LOG_CSV, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["name", "class", "nisn", "timestamp"])
        writer.writerow([student["name"], student["class"], student["nisn"], timestamp])


@app.post("/scan")
def scan(payload: ScanRequest):
    student = find_student(payload.nisn)
    if student is None:
        return {"status": "not_found", "nisn": payload.nisn}

    log_scan(student)
    return {
        "status": "success",
        "name": student["name"],
        "class": student["class"],
        "nisn": student["nisn"],
        "timestamp": datetime.now().isoformat(timespec="seconds"),
    }
