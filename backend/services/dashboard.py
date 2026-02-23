from db import db
from models import DashboardMetrics
from datetime import datetime

class DashboardService:
    @staticmethod
    def get_metrics() -> DashboardMetrics:
        with db.get_cursor() as cursor:
            # 1. Count Open Cases
            cursor.execute("SELECT COUNT(*) FROM sar_cases WHERE status != 'Filed'")
            open_cases = cursor.fetchone()[0]

            # 2. Count High Risk Alerts (Assuming join with customer risk level or denormalized)
            # For this MVP schema, we assume risk is stored on customer or passed through
            cursor.execute(
                """
                SELECT COUNT(*)
                FROM sar_cases c
                JOIN customers cust ON c.customer_id = cust.id
                WHERE cust.risk_level = 'High' AND c.status != 'Filed'
                """
            )
            high_risk = cursor.fetchone()[0]

            # 3. SARs Filed
            cursor.execute("SELECT COUNT(*) FROM sar_cases WHERE status = 'Filed'")
            sars_filed = cursor.fetchone()[0]

            # 4. Avg Resolution (Mock calculation for MVP as we don't have closed_at column in schema provided)
            # In prod: AVG(closed_at - created_at)
            avg_res = 4.2 

        return DashboardMetrics(
            open_cases=open_cases,
            high_risk_alerts=high_risk,
            sars_filed=sars_filed,
            avg_resolution_days=avg_res,
            last_updated=datetime.now()
        )
