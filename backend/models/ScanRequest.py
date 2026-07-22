from pydantic import BaseModel


class ScanRequest(BaseModel):
    nisn: str
