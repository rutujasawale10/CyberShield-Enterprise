from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, ScanLog, AuditLog
from app.schemas import UserResponse
from app.auth import require_role

router = APIRouter(prefix="/admin", tags=["Admin Management Console"])

@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role(["Admin"]))
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [UserResponse.model_validate(u) for u in users]

@router.put("/users/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: int,
    new_role: str,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role(["Admin"]))
):
    if new_role not in ["Admin", "Analyst", "User"]:
        raise HTTPException(status_code=400, detail="Invalid role specified. Must be Admin, Analyst, or User.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = new_role
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)

@router.delete("/clear-logs")
def clear_all_scan_logs(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role(["Admin"]))
):
    deleted_count = db.query(ScanLog).delete()
    db.commit()
    return {"message": "All scan audit logs cleared successfully", "deleted_count": deleted_count}
