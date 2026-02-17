from datetime import datetime
from typing import List
from models import SARReport, SARNarrativeSection
from services.cases import CaseService

class ReportService:
    @staticmethod
    def generate_sar_report(case_id: str) -> SARReport:
        # Fetch data source
        case_data = CaseService.get_case_detail(case_id)
        
        # Calculate aggregates for narrative
        total_flow = sum(t.amount for t in case_data.transactions)
        flagged_txs = [t for t in case_data.transactions if t.flagged]
        
        # 1. Executive Summary
        summary_text = (
            f"A review of transaction activity for {case_data.customer_name} ({case_data.customer_id}) "
            f"was conducted following alerts for potential structuring. The customer operates in a high-risk industry. "
            f"The review identified ${total_flow:,.2f} in aggregate suspicious flows."
        )

        # 2. Structuring Narrative
        structuring_text = (
            "The account received multiple cash deposits appearing to be structured to avoid "
            "CTA reporting thresholds. Specific transactions include " + 
            ", ".join([f"{t.id} (${t.amount})" for t in flagged_txs[:3]]) + "."
        )

        # 3. Conclusion
        conclusion_text = (
            "The pattern of activity is inconsistent with the customer's historical profile and stated business purpose. "
            "SAR filing is recommended pursuant to 31 C.F.R. 1020.320(a)(2)."
        )

        sections = [
            SARNarrativeSection(
                title="1.0 Executive Summary",
                content=summary_text,
                supporting_evidence=[]
            ),
            SARNarrativeSection(
                title="2.0 Suspicious Activity Detail",
                content=structuring_text,
                supporting_evidence=[t.id for t in flagged_txs]
            ),
            SARNarrativeSection(
                title="3.0 Conclusion",
                content=conclusion_text,
                supporting_evidence=[]
            )
        ]

        return SARReport(
            case_id=case_id,
            generated_at=datetime.now(),
            subject_information={
                "name": case_data.customer_name,
                "id": case_data.customer_id,
                "risk_rating": case_data.risk_level
            },
            suspicious_activity_information={
                "category": "Structuring",
                "cumulative_amount": total_flow,
                "date_range_start": case_data.transactions[-1].date if case_data.transactions else "",
                "date_range_end": case_data.transactions[0].date if case_data.transactions else ""
            },
            narrative=sections
        )
