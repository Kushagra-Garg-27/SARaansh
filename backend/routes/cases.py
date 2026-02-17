from fastapi import APIRouter, HTTPException
from typing import List
from models import CaseSummary, CaseDetail, ActionResponse
from services.cases import CaseService

router = APIRouter(prefix="/cases", tags=["Cases"])

@router.get("/active", response_model=List[CaseSummary])
def get_active_cases():
    return CaseService.get_active_cases()

@router.get("/{case_id}", response_model=CaseDetail)
def get_case_detail(case_id: str):
    return CaseService.get_case_detail(case_id)

@router.post("/{case_id}/escalate", response_model=ActionResponse)
def escalate_case(case_id: str):
    # In a real app, actor comes from JWT token
    success = CaseService.escalate_case(case_id, actor="System User")
    return ActionResponse(
        success=success,
        message="Case escalated successfully",
        new_status="Escalated"
    )

@router.post("/{case_id}/submit", response_model=ActionResponse)
def submit_sar(case_id: str):
    success = CaseService.submit_sar(case_id, actor="System User")
    return ActionResponse(
        success=success,
        message="SAR filed successfully",
        new_status="Filed"
    )
