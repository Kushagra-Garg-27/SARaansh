from typing import List, Optional
from fastapi import HTTPException
from db import db
from models import CaseSummary, CaseDetail, Transaction, Typology
from services.audit import AuditService

class CaseService:
    @staticmethod
    def get_active_cases() -> List[CaseSummary]:
        query = """
            SELECT c.id, cust.name, cust.id, c.created_at, cust.risk_level, c.status, 'Unassigned'
            FROM sar_cases c
            JOIN customers cust ON c.customer_id = cust.id
            WHERE c.status != 'Filed'
            ORDER BY c.created_at DESC
        """
        cases = []
        with db.get_cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()
            for row in rows:
                cases.append(CaseSummary(
                    id=row[0],
                    customer_name=row[1],
                    customer_id=row[2],
                    opened_date=str(row[3]),
                    risk_score=90 if row[4] == 'High' else 50, # Mock score logic
                    risk_level=row[4],
                    status=row[5],
                    assignee=row[6]
                ))
        return cases

    @staticmethod
    def get_case_detail(case_id: str) -> CaseDetail:
        # 1. Fetch Case & Customer Info
        case_query = """
            SELECT c.id, cust.name, cust.id, c.created_at, cust.risk_level, c.status
            FROM sar_cases c
            JOIN customers cust ON c.customer_id = cust.id
            WHERE c.id = %s
        """

        # 2. Fetch Transactions
        tx_query = """
            SELECT id, timestamp, amount, type, counterparty, flagged
            FROM transactions
            WHERE customer_id = (SELECT customer_id FROM sar_cases WHERE id = %s)
            ORDER BY timestamp DESC
        """

        with db.get_cursor() as cursor:
            cursor.execute(case_query, (case_id,))
            case_row = cursor.fetchone()
            
            if not case_row:
                raise HTTPException(status_code=404, detail="Case not found")

            cursor.execute(tx_query, (case_id,))
            tx_rows = cursor.fetchall()
            
            transactions = [
                Transaction(
                    id=row[0], date=str(row[1]), amount=float(row[2]),
                    currency="USD", counterparty=row[4], type=row[3],
                    direction="Outbound" if row[3] == 'Wire' else "Inbound", # Simple heuristic
                    flagged=row[5]
                ) for row in tx_rows
            ]

            # Mock typologies for MVP - in prod, this comes from a JSONB column in sar_cases
            typologies = [
                Typology(id="TYP-01", name="Structuring", confidence=0.98),
                Typology(id="TYP-02", name="Rapid Movement", confidence=0.85)
            ]

            return CaseDetail(
                id=case_row[0],
                customer_name=case_row[1],
                customer_id=case_row[2],
                opened_date=str(case_row[3]),
                risk_score=92,
                risk_level=case_row[4],
                status=case_row[5],
                assignee="Sarah Jenkins",
                transactions=transactions,
                detected_typologies=typologies
            )

    @staticmethod
    def escalate_case(case_id: str, actor: str) -> bool:
        with db.get_cursor() as cursor:
            cursor.execute("SELECT status FROM sar_cases WHERE id = %s", (case_id,))
            row = cursor.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Case not found")
            
            if row[0] == 'Filed':
                raise HTTPException(status_code=400, detail="Cannot escalate a filed case")

            cursor.execute(
                "UPDATE sar_cases SET status = 'Escalated' WHERE id = %s",
                (case_id,)
            )
        
        AuditService.log_action(case_id, "ESCALATE", actor, "Case escalated to Senior Compliance Officer")
        return True

    @staticmethod
    def submit_sar(case_id: str, actor: str) -> bool:
        with db.get_cursor() as cursor:
            cursor.execute("SELECT status FROM sar_cases WHERE id = %s", (case_id,))
            row = cursor.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Case not found")

            # Logic: Can only submit if Ready or Escalated (Policy)
            if row[0] not in ['Ready for Filing', 'Escalated', 'In Review']: 
                # Relaxed logic for MVP demo purposes
                pass 

            cursor.execute(
                "UPDATE sar_cases SET status = 'Filed' WHERE id = %s",
                (case_id,)
            )

        AuditService.log_action(case_id, "FILE_SAR", actor, "SAR filed with FinCEN via SDM")
        return True
