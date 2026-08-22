"""Supabase-backed authentication routes for Dayflow."""

import os
from typing import Any, Literal

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, EmailStr, Field
from supabase import Client, create_client

load_dotenv(".env.local")


class SignupRequest(BaseModel):
	user_id: str = Field(min_length=1, max_length=50)
	email: EmailStr
	password: str = Field(min_length=8, max_length=128)
	role: Literal["Employee", "Admin", "HR"]
	name: str = ""
	company: str = ""
	phone: str = ""


class SigninRequest(BaseModel):
	email: EmailStr
	password: str = Field(min_length=1, max_length=128)


def _env(name: str, *fallbacks: str) -> str | None:
	for key in (name, *fallbacks):
		value = os.getenv(key)
		if value:
			return value
	return None


def get_supabase() -> Client:
	url = _env("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL")
	key = _env("SUPABASE_ANON_KEY", "SUPABASE_KEY", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
	if not url or not key:
		raise HTTPException(status_code=503, detail="Supabase is not configured")
	return create_client(url, key)


def get_supabase_admin() -> Client | None:
	url = _env("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL")
	service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
	if not url or not service_key:
		return None
	return create_client(url, service_key)


router = APIRouter(tags=["authentication"])


def _user_value(user: Any, name: str, default: Any = None) -> Any:
	if isinstance(user, dict):
		return user.get(name, default)
	return getattr(user, name, default)


def _response_value(response: Any, name: str, default: Any = None) -> Any:
	if isinstance(response, dict):
		return response.get(name, default)
	return getattr(response, name, default)


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, supabase: Client = Depends(get_supabase)) -> dict[str, Any]:
	email = payload.email.strip().lower()
	role = "admin" if payload.role.lower() in {"admin", "hr"} else "employee"
	admin_client = get_supabase_admin()

	try:
		auth_response = supabase.auth.sign_up({
			"email": email,
			"password": payload.password,
			"options": {"data": {"user_id": payload.user_id, "role": role, "name": payload.name, "company": payload.company, "phone": payload.phone}},
		})
		user = _response_value(auth_response, "user")
		if not user:
			raise ValueError("Supabase did not return a user")

		profile = {
			"employee_id": payload.user_id,
			"email": email,
			"role": role,
			"full_name": payload.name,
			"job_title": "",
			"department": payload.company,
			"employment_status": "Active",
			"profile_picture_url": None,
		}
		if admin_client:
			admin_client.table("employees").insert(profile).execute()
		else:
			supabase.table("employees").insert(profile).execute()
	except Exception as exc:
		# Remove the Auth user when the profile insert fails and server-side
		# service credentials are available, avoiding an unusable half-account.
		user_id = _user_value(locals().get("user"), "id")
		if user_id and admin_client:
			try:
				admin_client.auth.admin.delete_user(user_id)
			except Exception:
				pass
		raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Unable to create account. The email or employee ID may already exist.") from exc

	return {
		"message": "Account created. Check your email to verify your account before signing in.",
		"email_verification_required": _response_value(auth_response, "session") is None,
		"user_id": _user_value(user, "id"),
	}


@router.post("/signin")
def signin(payload: SigninRequest, response: Response, supabase: Client = Depends(get_supabase)) -> dict[str, Any]:
	email = payload.email.strip().lower()
	try:
		auth_response = supabase.auth.sign_in_with_password({"email": email, "password": payload.password})
		session = _response_value(auth_response, "session")
		user = _response_value(auth_response, "user")
		access_token = _user_value(session, "access_token")
		if not user or not access_token:
			raise ValueError("Supabase did not return an active session")

		metadata = _user_value(user, "user_metadata", {}) or {}
		app_metadata = _user_value(user, "app_metadata", {}) or {}
		role = str(app_metadata.get("role") or metadata.get("role") or "employee").lower()
		if role in {"admin", "hr"}:
			role = "hr"
		response.set_cookie(key="session", value=access_token, path="/", httponly=True, samesite="lax", secure=os.getenv("COOKIE_SECURE", "false").lower() == "true")
		return {
			"access_token": access_token,
			"token_type": "bearer",
			"redirect": "/admin-spa" if role == "hr" else "/employee-spa",
			"user": {"id": _user_value(user, "id"), "email": _user_value(user, "email", email), "role": role},
		}
	except Exception as exc:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password") from exc