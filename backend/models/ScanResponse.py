from pydantic import BaseModel
from typing import Optional


class ScanResponse(BaseModel):
    status: str
    name: Optional[str] = None
    class_name: Optional[str] = None
    nisn: Optional[str] = None
    timestamp: Optional[str] = None
