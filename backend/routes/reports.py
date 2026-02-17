from fastapi import APIRouter
from models import SARReport
from services.reports import ReportService

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/sar/{case_id}", response_model=SARReport)
def generate_sar_report(case_id: str):
    return ReportService.generate_sar_report(case_id)
