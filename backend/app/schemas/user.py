from pydantic import BaseModel, EmailStr, ConfigDict


class UserCreate(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "username": "johndoe",
                "email": "example@mail.com",
                "password": "password123",
            }
        },
    )

    username: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: EmailStr


class UserLogin(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {"username": "johndoe", "password": "password123"}
        },
    )

    username: str
    password: str


class UserGet(BaseModel):
    model_config = ConfigDict(
        from_attributes=True, json_schema_extra={"example": {"username": "johndoe"}}
    )

    username: str


class Token(BaseModel):
    access_token: str
    token_type: str
