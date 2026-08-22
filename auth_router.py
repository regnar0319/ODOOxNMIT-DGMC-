"""Supabase-backed authentication routes for Dayflow."""

import os
import re
import logging
from typing import Any, Literal

<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
=======
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, EmailStr, Field
>>>>>>> 05e260b85b22d538e46272c3fadb8495a63f1ebf
from supabase import Client, create_client

load_dotenv(".env.local")


class SignupRequest(BaseModel):
<<<<<<< HEAD
	employee_id: str = Field(min_length=1, max_length=50)
	email: str
=======
	user_id: str = Field(min_length=1, max_length=50)
	email: EmailStr
>>>>>>> 05e260b85b22d538e46272c3fadb8495a63f1ebf
	password: str = Field(min_length=8, max_length=128)
	role: Literal["Employee", "Admin", "HR"]
	name: str = ""
	company: str = ""
	phone: str = ""


class SigninRequest(BaseModel):
	email: str
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
logger = logging.getLogger(__name__)


def _user_value(user: Any, name: str, default: Any = None) -> Any:
	if isinstance(user, dict):
		return user.get(name, default)
	return getattr(user, name, default)


def _response_value(response: Any, name: str, default: Any = None) -> Any:
	if isinstance(response, dict):
		return response.get(name, default)
	return getattr(response, name, default)


def _result_data(response: Any) -> Any:
	return _response_value(response, "data", response)


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, supabase: Client = Depends(get_supabase)) -> dict[str, Any]:
	email = payload.email.strip().lower()
<<<<<<< HEAD
	if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
		raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Please enter a valid email address.")
	role = payload.role.lower()
	if role == "admin":
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="HR accounts must be provisioned by an administrator.")
	role = "employee"
=======
	role = "admin" if payload.role.lower() in {"admin", "hr"} else "employee"
>>>>>>> 05e260b85b22d538e46272c3fadb8495a63f1ebf
	admin_client = get_supabase_admin()
	if not admin_client:
		raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Account provisioning is not configured.")

	try:
		auth_response = supabase.auth.sign_up({
			"email": email,
			"password": payload.password,
			"options": {"data": {"user_id": payload.user_id, "role": role, "name": payload.name, "company": payload.company, "phone": payload.phone}},
		})
		user = _response_value(_result_data(auth_response), "user")
		if not user:
			raise ValueError("Supabase did not return a user")
		auth_user_id = _user_value(user, "id")
		if not auth_user_id:
			raise ValueError("Supabase user has no ID")

		profile = {
<<<<<<< HEAD
			"auth_user_id": auth_user_id,
			"employee_id": payload.employee_id,
=======
			"employee_id": payload.user_id,
>>>>>>> 05e260b85b22d538e46272c3fadb8495a63f1ebf
			"email": email,
			"role": role,
			"full_name": payload.name,
			"job_title": "",
			"department": payload.company,
			"employment_status": "Active",
			"profile_picture_url": None,
		}
		admin_client.table("employees").insert(profile).execute()
	except HTTPException:
		raise
	except Exception as exc:
		# Remove the Auth user when the profile insert fails and server-side
		# service credentials are available, avoiding an unusable half-account.
		user_id = _user_value(locals().get("user"), "id")
		if user_id and admin_client:
			try:
				admin_client.auth.admin.delete_user(user_id)
			except Exception:
				pass
		logger.exception("Signup failed while provisioning employee profile")
		raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Unable to create account. The email or employee ID may already exist.") from exc

	return {
		"message": "Account created. Check your email to verify your account before signing in.",
		"email_verification_required": _response_value(auth_response, "session") is None,
		"user_id": _user_value(user, "id"),
	}


@router.post("/signin")
def signin(payload: SigninRequest, response: Response, supabase: Client = Depends(get_supabase)) -> dict[str, Any]:
	email = payload.email.strip().lower()
	if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
		raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Please enter a valid email address.")
	try:
		auth_response = supabase.auth.sign_in_with_password({"email": email, "password": payload.password})
		session = _response_value(auth_response, "session")
		user = _response_value(auth_response, "user")
		access_token = _user_value(session, "access_token")
		if not user or not access_token:
			raise ValueError("Supabase did not return an active session")

		metadata = _user_value(user, "user_metadata", {}) or {}
		app_metadata = _user_value(user, "app_metadata", {}) or {}
<<<<<<< HEAD
		role = app_metadata.get("role") or metadata.get("role") or "employee"
		employee = None
		admin_client = get_supabase_admin()
		if admin_client:
			profile_response = admin_client.table("employees").select("*").eq("auth_user_id", _user_value(user, "id")).limit(1).execute()
			employee = profile_response.data[0] if profile_response.data else None
		if not employee:
			raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Your account is authenticated, but your employee profile could not be found. Please contact HR.")
		role = employee.get("role") or role
=======
		role = str(app_metadata.get("role") or metadata.get("role") or "employee").lower()
		if role in {"admin", "hr"}:
			role = "hr"
		response.set_cookie(key="session", value=access_token, path="/", httponly=True, samesite="lax", secure=os.getenv("COOKIE_SECURE", "false").lower() == "true")
>>>>>>> 05e260b85b22d538e46272c3fadb8495a63f1ebf
		return {
			"access_token": access_token,
			"token_type": "bearer",
			"redirect": "/admin-spa" if role == "hr" else "/employee-spa",
			"user": {"id": _user_value(user, "id"), "email": _user_value(user, "email", email), "role": role},
			"employee": employee,
		}
	except HTTPException:
		raise
	except Exception as exc:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password") from exc