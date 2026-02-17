from fastapi import APIRouter
from models import DashboardMetrics
from services.dashboard import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/metrics", response_model=DashboardMetrics)
def get_dashboard_metrics():
    return DashboardService.get_metrics()
