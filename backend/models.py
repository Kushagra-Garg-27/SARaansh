from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime
from enum import Enum

class RiskLevel(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class CaseStatus(str, Enum):
    OPEN = "Open"
    IN_REVIEW = "In Review"
    DRAFTING = "Drafting"
    QA_PENDING = "QA Pending"
    FILED = "Filed"
    ESCALATED = "Escalated"
    READY_FOR_FILING = "Ready for Filing"

# --- Transaction Models ---
class Transaction(BaseModel):
    id: str
    date: str
    amount: float
    currency: str
    counterparty: str
    type: str
    direction: str
    flagged: bool
    description: Optional[str] = None

# --- Case Models ---
class Typology(BaseModel):
    id: str
    name: str
    confidence: float

class CaseSummary(BaseModel):
    id: str
    customer_name: str
    customer_id: str
    opened_date: str
    risk_score: int
    risk_level: RiskLevel
    status: CaseStatus
    assignee: Optional[str]

class CaseDetail(CaseSummary):
    transactions: List[Transaction]
    detected_typologies: List[Typology]

# --- Dashboard Models ---
class DashboardMetrics(BaseModel):
    open_cases: int
    high_risk_alerts: int
    sars_filed: int
    avg_resolution_days: float
    last_updated: datetime

# --- SAR Report Models ---
class SARNarrativeSection(BaseModel):
    title: str
    content: str
    supporting_evidence: List[str]

class SARReport(BaseModel):
    case_id: str
    generated_at: datetime
    filing_institution: str = "SARaansh Financial Services"
    subject_information: dict
    suspicious_activity_information: dict
    narrative: List[SARNarrativeSection]

# --- Action Models ---
class ActionResponse(BaseModel):
    success: bool
    message: str
    new_status: str
