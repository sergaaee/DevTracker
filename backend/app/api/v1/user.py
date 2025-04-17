from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.utils import verify, hash
from app.db.models import User
from app.services.auth import register_user, login_user, get_user_by_username
from app.core.security import create_access_token
from app.schemas.user import UserOut, UserCreate, UserLogin, UserGet
from app.db.database import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from datetime import timedelta

router = APIRouter()


# Функция для получения информации о пользователе
@router.get("/user", response_model=UserOut)
def get_me(username: str, db: Session = Depends(get_db)):
    """
    Получение информации о текущем пользователе.
    """
    return get_user_by_username(username, db)
