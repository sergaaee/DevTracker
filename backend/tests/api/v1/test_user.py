import pytest
from tests import client_override as client

endpoint = "api/v1/user/"

user_data = dict(username="sergaaee", password="pp480177", email="sergoiwj@gmail.com")

login_user_data = dict(username="sergaaee", password="pp480177")

wrong_password = "1234"
wrong_username = "wro"
wrong_email = "1234"


@pytest.fixture
def setup_and_set_down_acts(client):
    client.post("api/v1/auth/register", json=user_data)
    yield
    client.delete(endpoint, params={"username": user_data["username"]})


def test_delete_user(client):
    response = client.post("api/v1/auth/register", json=user_data)
    assert response.status_code == 200

    response = client.delete(f"{endpoint}", params={"username": user_data["username"]})
    assert response.status_code == 200


def test_register_user(client):
    response = client.post("api/v1/auth/register", json=user_data)
    assert response.status_code == 200
    assert response.json()["user"]["username"] == user_data["username"]


def test_register_user_with_existing_username(client):
    client.post("api/v1/auth/register", json=user_data)
    response = client.post("api/v1/auth/register", json=user_data)
    assert response.status_code == 400
    assert (
        "Пользователь с таким логином или почтой уже существует"
        in response.json()["detail"]
    )


def test_register_user_with_invalid_email(client):
    invalid_user_data = user_data.copy()
    invalid_user_data["email"] = wrong_email
    response = client.post("api/v1/auth/register", json=invalid_user_data)
    assert response.status_code == 422


def test_register_user_with_existing_email(client):
    client.post("api/v1/auth/register", json=user_data)
    invalid_user_data = user_data.copy()
    invalid_user_data["username"] = wrong_username
    response = client.post("api/v1/auth/register", json=user_data)
    assert response.status_code == 400
    assert (
        "Пользователь с таким логином или почтой уже существует"
        in response.json()["detail"]
    )


def test_login_user(client, setup_and_set_down_acts):
    response = client.post("api/v1/auth/login", json=login_user_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["user"]["username"] == user_data["username"]


def test_login_user_with_wrong_password(client, setup_and_set_down_acts):
    wrong_user_data = login_user_data.copy()
    wrong_user_data["password"] = wrong_password
    response = client.post("api/v1/auth/login", json=wrong_user_data)
    assert response.status_code == 401
    assert "Неверный пароль" in response.json()["detail"]


def test_login_user_with_wrong_username(client, setup_and_set_down_acts):
    wrong_user_data = login_user_data.copy()
    wrong_user_data["username"] = wrong_username
    response = client.post("api/v1/auth/login", json=wrong_user_data)
    assert response.status_code == 401
    assert "Неверный логин" in response.json()["detail"]


def test_get_me(client, setup_and_set_down_acts):
    response = client.get(f"{endpoint}", params={"username": user_data["username"]})
    assert response.status_code == 200
    assert response.json()["username"] == user_data["username"]
    assert response.json()["email"] == user_data["email"]


def test_get_me_with_wrong_username(client, setup_and_set_down_acts):
    response = client.get(f"{endpoint}", params={"username": wrong_username})
    assert response.status_code == 404
    assert "User not found" in response.json()["detail"]
