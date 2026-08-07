from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import DATABASE_URL, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db_seed():
    """Initializes tables and seeds default admin user."""
    from app.models import User, ScanLog, ThreatFeed, BlockedURL, AuditLog
    from app.auth import hash_password

    # Ensure all new ORM models are registered before create_all
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == DEFAULT_ADMIN_EMAIL).first()
        if not admin:
            admin_user = User(
                email=DEFAULT_ADMIN_EMAIL,
                hashed_password=hash_password(DEFAULT_ADMIN_PASSWORD),
                full_name="CyberShield Administrator",
                role="Admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print(f"[OK] Default Admin Seeded: {DEFAULT_ADMIN_EMAIL} (Role: Admin)")

        # Seed initial multi-classification logs if empty
        if db.query(ScanLog).count() == 0:
            initial_logs = [
                ScanLog(
                    url="http://amaz0n-login.xyz",
                    domain="amaz0n-login.xyz",
                    status="Phishing",
                    risk_score=92.5,
                    confidence_score=98.0,
                    reasons=["Typosquatting brand spoofing detected", "Uses high-risk .xyz TLD"],
                    extracted_features={"is_https": 0, "fake_domain_pattern": 1, "suspicious_tld": 1}
                ),
                ScanLog(
                    url="http://login-portal-update.com",
                    domain="login-portal-update.com",
                    status="Suspicious",
                    risk_score=54.0,
                    confidence_score=91.5,
                    reasons=["Insecure HTTP protocol", "Contains sensitive keyword [login, update]"],
                    extracted_features={"is_https": 0, "has_suspicious_keyword": 1}
                ),
                ScanLog(
                    url="http://secure-auth-verify.org",
                    domain="secure-auth-verify.org",
                    status="Suspicious",
                    risk_score=48.5,
                    confidence_score=90.0,
                    reasons=["Insecure HTTP protocol", "Contains sensitive keyword [secure, verify]"],
                    extracted_features={"is_https": 0, "has_suspicious_keyword": 1}
                ),
                ScanLog(
                    url="https://www.google.com",
                    domain="google.com",
                    status="Safe",
                    risk_score=4.0,
                    confidence_score=99.0,
                    reasons=["Standard domain structure verified with SSL/HTTPS protection"],
                    extracted_features={"is_https": 1, "fake_domain_pattern": 0}
                )
            ]
            db.add_all(initial_logs)
            db.commit()
            print("[OK] Initial Multi-Classification Audit Logs Seeded (Safe, Suspicious, Phishing).")
    except Exception as e:
        print(f"[WARNING] Error seeding admin account: {e}")
        db.rollback()
    finally:
        db.close()
