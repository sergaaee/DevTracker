from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    username: str
    password: str

    class Config:
        orm_mode = True
        schema_extra = {"example": {"username": "johndoe", "password": "password123"}}


class UserGet(BaseModel):
    username: str

    class Config:
        orm_mode = True
        schema_extra = {"example": {"username": "johndoe"}}


class Token(BaseModel):
    access_token: str
    token_type: str
