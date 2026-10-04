from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserCreate, UserResponse, Token, UserUpdate, LoginRequest
from app.utils.security import verify_password, get_password_hash, create_access_token, decode_access_token

router = APIRouter(tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login-form", auto_error=False)

def _normalized_email(email: str) -> str:
    return email.strip().lower()

def _find_user_by_email(db: Session, email: str) -> Optional[User]:
    normalized_email = _normalized_email(email)
    return db.query(User).filter(func.lower(func.trim(User.email)) == normalized_email).first()

def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    email: str = payload.get("sub")
    if not email:
        return None
    return _find_user_by_email(db, email)

def require_current_user(user: Optional[User] = Depends(get_current_user)) -> User:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    email = _normalized_email(user_in.email)
    existing_user = _find_user_by_email(db, email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists"
        )
    
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        full_name=user_in.full_name,
        email=email,
        hashed_password=hashed_pwd,
        farm_name=user_in.farm_name or "Green Acres Farm",
        farm_location=user_in.farm_location or "California, USA"
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists",
        ) from error
    db.refresh(user)

    token = create_access_token({"sub": user.email, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=Token)
def login_json(credentials: LoginRequest, db: Session = Depends(get_db)):
    email = _normalized_email(credentials.email or credentials.username or "")
    if not email or not credentials.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required"
        )

    user = _find_user_by_email(db, email)
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    token = create_access_token({"sub": user.email, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login-form", response_model=Token)
def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = _find_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    token = create_access_token({"sub": user.email, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(require_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
@router.put("/me", response_model=UserResponse)
def update_profile(
    profile_in: UserUpdate,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    if profile_in.full_name is not None and profile_in.full_name.strip():
        current_user.full_name = profile_in.full_name.strip()
    if profile_in.farm_name is not None and profile_in.farm_name.strip():
        current_user.farm_name = profile_in.farm_name.strip()
    if profile_in.farm_location is not None and profile_in.farm_location.strip():
        current_user.farm_location = profile_in.farm_location.strip()
    
    db.commit()
    db.refresh(current_user)
    return current_user
