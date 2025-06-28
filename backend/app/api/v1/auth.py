from fastapi import APIRouter, HTTPException
from app.utils import verify, hash
from app.db.models import User
from app.services.auth import get_user_by_username, get_user_by_email
from app.core.security import create_access_token
from app.schemas.user import UserCreate, UserLogin
from app.db.database import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from datetime import timedelta

router = APIRouter()


# Функция для логина
@router.post("/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    """
    Логин пользователя.
    """
    db_user = get_user_by_username(user.username, db)  # Получаем пользователя из БД
    if not db_user:
        raise HTTPException(status_code=401, detail="Неверный логин")
    if not verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный пароль")

    token = create_access_token({"sub": user.username})  # Создаем токен
    return {"access_token": token, "token_type": "bearer", "user": db_user}


# Функция для регистрации
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_username(user.username, db)
    db_user_email = get_user_by_email(user.email, db)
    if db_user or db_user_email:
        raise HTTPException(
            status_code=400,
            detail="Пользователь с таким логином или почтой уже существует",
        )

    hashed_password = hash(user.password)
    new_user = User(
        username=user.username, hashed_password=hashed_password, email=user.email
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.username}, timedelta(minutes=60))
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": new_user.id, "username": new_user.username},
    }
