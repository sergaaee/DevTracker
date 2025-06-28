# filepath: /home/d10658/Desktop/my_proj/backend/tests/conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db import Base, get_db
from fastapi.testclient import TestClient
from app.main import app

# Создаем тестовую базу данных SQLite в памяти
TEST_DATABASE_URL = "sqlite:///./backend/tests/test.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Фикстура для базы данных
@pytest.fixture(scope="function")
def db_session():
    # Создаем таблицы
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    print(f"Using database in tests: {session.get_bind().url}")
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


# Переопределяем зависимость get_db для использования тестовой базы данных
@pytest.fixture(scope="function")
def client_override(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
