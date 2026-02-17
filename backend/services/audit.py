from datetime import datetime
from db import db
import uuid

class AuditService:
    @staticmethod
    def log_action(case_id: str, action: str, actor: str, details: str = ""):
        """
        Inserts an immutable record into the audit_logs table.
        """
        log_id = f"LOG-{uuid.uuid4().hex[:8].upper()}"
        timestamp = datetime.now()

        with db.get_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO audit_logs (id, case_id, action, actor, details, timestamp)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (log_id, case_id, action, actor, details, timestamp)
            )
        return log_id
