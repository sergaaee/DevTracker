from sqlalchemy.orm import Session
from app.db import models
from app.schemas import user as user_schema
from app.utils import hash, verify
from app.core.security import create_access_token
from datetime import timedelta
from fastapi import HTTPException


def register_user(user: user_schema.UserCreate, db: Session):
    new_user = models.User(username=user.username, hashed_password=hash(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def login_user(user: user_schema.UserLogin, db: Session):
    db_user = db.query(models.User).filter_by(username=user.username).first()
    if not db_user or not verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": db_user.username}, timedelta(minutes=60))
    return token


def get_user_by_username(username: str, db: Session):
    return db.query(models.User).filter_by(username=username).first()
