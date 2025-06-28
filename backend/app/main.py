from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import user as user_routes
from app.api.v1 import auth as auth_routes
from app.db import engine, Base

from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Создаем таблицы при запуске приложения
    Base.metadata.create_all(bind=engine)
    yield
    print("Application is shutting down...")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes.router, prefix="/api/v1", tags=["Users"])
app.include_router(auth_routes.router, prefix="/api/v1/auth", tags=["Auth"])
