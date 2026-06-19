from fastapi import APIRouter, HTTPException, Response, Request, Depends, status
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from services.auth_service import (
    get_password_hash, verify_password, create_access_token, 
    create_refresh_token, verify_token
)
from database import get_database

router = APIRouter(prefix="/api/auth", tags=["auth"])

class UserSignup(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: str = "viewer"

class UserSignin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    created_at: str
    last_login: str
    is_active: bool

async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    db = get_database()
    if db is None:
        # DB not initialized
        return payload
        
    user = await db.users.find_one({"email": payload.get("sub")})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "viewer")
    }

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserSignup):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    now_str = datetime.utcnow().isoformat()
    
    new_user = {
        "name": user.name,
        "email": user.email,
        "password_hash": hashed_password,
        "role": user.role,
        "created_at": now_str,
        "last_login": now_str,
        "is_active": True
    }
    
    result = await db.users.insert_one(new_user)
    return {"message": "User created successfully", "id": str(result.inserted_id)}

@router.post("/signin")
async def signin(user: UserSignin, response: Response):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Update last login
    now_str = datetime.utcnow().isoformat()
    await db.users.update_one({"_id": db_user["_id"]}, {"$set": {"last_login": now_str}})
    
    access_token = create_access_token(data={"sub": db_user["email"], "role": db_user.get("role", "viewer")})
    refresh_token = create_refresh_token(data={"sub": db_user["email"]})
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=1800, # 30 mins
        samesite="lax"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=604800, # 7 days
        samesite="lax"
    )
    
    return {
        "message": "Logged in successfully",
        "user": {
            "name": db_user["name"],
            "email": db_user["email"],
            "role": db_user.get("role", "viewer")
        }
    }

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}

from typing import Optional

@router.get("/me", response_model=Optional[UserResponse])
async def get_me(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        return None
    payload = verify_token(token)
    if not payload:
        return None
        
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    user = await db.users.find_one({"email": payload.get("sub")})
    if not user:
        return None
        
    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        role=user.get("role", "viewer"),
        created_at=user.get("created_at", ""),
        last_login=user.get("last_login", ""),
        is_active=user.get("is_active", True)
    )
