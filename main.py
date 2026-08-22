from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import re
from urllib.parse import parse_qs, urlparse
from http import cookies
from datetime import datetime, date, timezone
import os
import mimetypes
try:
	from supabase import create_client
except Exception:
	create_client = None

# Supabase client initialization (uses environment variables)
SUPABASE_URL = os.environ.get('SUPABASE_URL') or os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY') or os.environ.get('SUPABASE_ANON_KEY') or os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
if create_client and SUPABASE_URL and SUPABASE_KEY:
	try:
		supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
	except Exception:
		supabase = None
else:
	supabase = None

def get_supabase():
	if not supabase:
		raise RuntimeError('Supabase client not configured. Set SUPABASE_URL and SUPABASE_KEY.')
	return supabase

# Provide an ASGI app so Render/uvicorn can import `main:app`.
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse, PlainTextResponse

app = FastAPI()


def _parse_cookies_from_header(cookie_header: str):
	if not cookie_header:
		return {}
	c = cookies.SimpleCookie()
	c.load(cookie_header)
	return {k: v.value for k, v in c.items()}


def _current_user_email_from_request(request: Request):
	ck = _parse_cookies_from_header(request.headers.get('cookie', ''))
	session = ck.get('session', '')
	if not session:
		return None
	if supabase and not session.endswith('@dayflow.com'):
		try:
			user_response = supabase.auth.get_user(session)
			user = getattr(user_response, 'user', None)
			email = getattr(user, 'email', None)
			if email:
				metadata = getattr(user, 'app_metadata', {}) or {}
				role = metadata.get('role', 'employee')
				USERS.setdefault(email.lower(), {'role': role, 'active': True})
				if role == 'employee':
					EMPLOYEES.setdefault(email.lower(), {
						'profile': {'name': email.split('@')[0], 'email': email.lower(), 'phone': '', 'address': '', 'job_title': '', 'department': ''},
						'attendance': [], 'leaves': [], 'payroll': {'salary': 0, 'currency': 'USD', 'last_payslip': None},
					})
				return email.lower()
		except Exception:
			return None
	return session


HOST = "127.0.0.1"
PORT = 8000

# Demo identities keep the standalone prototype usable without a database.
USERS = {
		"employee@dayflow.com": {"password": "Employee@123", "role": "employee"},
		"hr@dayflow.com": {"password": "HrAdmin@123", "role": "hr"},
}

# Demo employee records (in-memory prototype)
EMPLOYEES = {
	"employee@dayflow.com": {
		"profile": {
			"name": "Alex Employee",
			"email": "employee@dayflow.com",
			"phone": "555-0101",
			"address": "123 Dayflow Ave",
			"job_title": "Software Engineer",
			"department": "Engineering",
		},
		"attendance": [],  # list of {date: 'YYYY-MM-DD', checkin: t, checkout: t, status: 'Present'|...}
		"leaves": [],  # list of {id, type, from, to, remarks, status}
		"payroll": {"salary": 72000, "currency": "USD", "last_payslip": "2026-07-31"},
	}
}


PAGE = r'''<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Sign in | Dayflow</title>
	<style>
		:root {
			--ink: #17211c;
			--muted: #68766e;
			--line: #dce5df;
			--paper: #fbfcfa;
			--green: #1f6046;
			--green-dark: #164b36;
			--lime: #c8ef62;
			--error: #b33e3e;
		}
		* { box-sizing: border-box; }
		body {
			margin: 0; min-height: 100vh; color: var(--ink); background: var(--paper);
			font-family: Georgia, "Times New Roman", serif;
		}
		button, input { font: inherit; }
		.shell { min-height: 100vh; display: grid; grid-template-columns: minmax(430px, 43%) 1fr; }
		.brand-panel {
			position: relative; overflow: hidden; display: flex; flex-direction: column;
			justify-content: space-between; padding: 46px clamp(38px, 6vw, 92px);
			color: #f7fbf4; background: var(--green-dark);
		}
		.brand-panel::before, .brand-panel::after { content: ""; position: absolute; border: 1px solid rgba(200,239,98,.18); border-radius: 50%; pointer-events: none; }
		.brand-panel::before { width: 530px; height: 530px; right: -290px; top: 15%; }
		.brand-panel::after { width: 330px; height: 330px; left: -190px; bottom: 8%; }
		.brand, .brand-copy, .highlights { position: relative; z-index: 1; }
		.brand { display: flex; align-items: center; gap: 12px; font: 700 20px Arial, sans-serif; letter-spacing: -.5px; }
		.mark { width: 30px; height: 30px; display: grid; place-items: center; color: var(--green-dark); background: var(--lime); border-radius: 9px 9px 9px 2px; font-size: 18px; }
		.brand-copy { max-width: 390px; margin: auto 0; padding: 70px 0 48px; }
		.eyebrow { margin: 0 0 20px; color: var(--lime); font: 700 11px Arial, sans-serif; letter-spacing: 2px; text-transform: uppercase; }
		h1 { margin: 0; font-size: clamp(42px, 5vw, 72px); font-weight: 400; line-height: .98; letter-spacing: -2.6px; }
		.tagline { margin: 25px 0 0; color: #cad9ce; font-size: 19px; line-height: 1.5; }
		.visual { position: relative; width: 220px; height: 170px; margin-top: 48px; }
		.visual::before { content: ""; position: absolute; width: 176px; height: 112px; left: 22px; top: 19px; border: 1px solid rgba(247,251,244,.42); border-radius: 50% 46% 48% 40%; transform: rotate(-16deg); }
		.visual::after { content: ""; position: absolute; width: 110px; height: 56px; left: 64px; top: 73px; border-left: 1px solid var(--lime); border-bottom: 1px solid var(--lime); border-radius: 0 0 0 100%; transform: rotate(11deg); }
		.orbit { position: absolute; width: 13px; height: 13px; border-radius: 50%; background: var(--lime); box-shadow: 0 0 0 8px rgba(200,239,98,.1); }
		.orbit.one { top: 11px; right: 25px; } .orbit.two { left: 17px; bottom: 13px; background: #f7fbf4; }
		.highlights { display: flex; flex-wrap: wrap; gap: 10px 22px; padding-top: 24px; border-top: 1px solid rgba(247,251,244,.18); font: 12px Arial, sans-serif; color: #cbd9cf; }
		.highlight { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
		.highlight i { width: 6px; height: 6px; display: inline-block; border-radius: 50%; background: var(--lime); }
		.form-panel { display: grid; place-items: center; padding: 40px 24px; background: #f5f7f3; }
		.form-wrap { width: min(100%, 420px); }
		.form-header { margin-bottom: 35px; }
		.form-header h2 { margin: 0 0 12px; font-size: 36px; font-weight: 400; letter-spacing: -1.2px; }
		.form-header p { margin: 0; color: var(--muted); font: 14px Arial, sans-serif; line-height: 1.6; }
		form { display: grid; gap: 20px; }
		.field { display: grid; gap: 8px; }
		label { font: 700 12px Arial, sans-serif; }
		.input-shell { display: flex; align-items: center; border: 1px solid var(--line); border-radius: 8px; background: white; transition: border-color .2s, box-shadow .2s; }
		.input-shell:focus-within { border-color: var(--green); box-shadow: 0 0 0 3px rgba(31,96,70,.12); }
		input { width: 100%; min-width: 0; border: 0; outline: 0; padding: 15px 16px; color: var(--ink); background: transparent; font: 14px Arial, sans-serif; }
		input::placeholder { color: #9aa69e; }
		.toggle { width: 46px; height: 44px; padding: 0; border: 0; color: var(--muted); background: transparent; cursor: pointer; font: 16px Arial, sans-serif; }
		.toggle:hover, .toggle:focus-visible { color: var(--green); }
		.assist { display: flex; justify-content: flex-end; margin-top: -8px; }
		.text-link { color: var(--green); text-decoration: none; font: 700 12px Arial, sans-serif; }
		.text-link:hover { text-decoration: underline; }
		.submit { min-height: 50px; margin-top: 2px; border: 0; border-radius: 8px; color: white; background: var(--green); cursor: pointer; font: 700 13px Arial, sans-serif; transition: background .2s, transform .2s; }
		.submit:hover { background: var(--green-dark); transform: translateY(-1px); }
		.submit:disabled { cursor: wait; opacity: .7; transform: none; }
		.signup { margin: 6px 0 0; text-align: center; color: var(--muted); font: 13px Arial, sans-serif; }
		.message { min-height: 18px; margin: -7px 0 0; color: var(--error); font: 12px Arial, sans-serif; }
		.message:empty { display: none; }
		.field.invalid input { color: var(--error); } .field.invalid .input-shell { border-color: var(--error); }
		@media (max-width: 760px) {
			.shell { display: block; }
			.brand-panel { min-height: 330px; padding: 28px 24px 25px; }
			.brand-copy { padding: 46px 0 32px; margin: 0; }
			.brand-copy h1 { font-size: 48px; }
			.tagline { margin-top: 15px; font-size: 16px; }
			.visual { display: none; }
			.highlights { gap: 9px 16px; padding-top: 17px; }
			.form-panel { min-height: calc(100vh - 330px); padding: 44px 24px 54px; }
			.form-header { margin-bottom: 29px; }
			.form-header h2 { font-size: 32px; }
		}
	</style>
</head>
<body>
	<main class="shell">
		<section class="brand-panel" aria-label="Dayflow overview">
			<div class="brand"><span class="mark" aria-hidden="true">d</span><span>Dayflow</span></div>
			<div class="brand-copy">
				<p class="eyebrow">Human resource management</p>
				<h1>Every workday,<br>perfectly aligned.</h1>
				<p class="tagline">A calmer, clearer way to keep your people moving forward.</p>
				<div class="visual" aria-hidden="true"><span class="orbit one"></span><span class="orbit two"></span></div>
			</div>
			<div class="highlights">
				<span class="highlight"><i></i>Employee Management</span>
				<span class="highlight"><i></i>Attendance Tracking</span>
				<span class="highlight"><i></i>Leave Management</span>
			</div>
		</section>
		<section class="form-panel">
			<div class="form-wrap">
				<header class="form-header"><h2>Welcome Back</h2><p>Sign in to continue to your Dayflow workspace.</p></header>
				<form id="signin-form" novalidate>
					<div class="field" id="email-field"><label for="email">Email</label><div class="input-shell"><input id="email" name="email" type="email" autocomplete="email" placeholder="Enter your email" required></div><p class="message" id="email-message" role="alert"></p></div>
					<div class="field" id="password-field"><label for="password">Password</label><div class="input-shell"><input id="password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required><button class="toggle" type="button" id="toggle-password" aria-label="Show password" aria-pressed="false">&#9673;</button></div><p class="message" id="password-message" role="alert"></p></div>
					<div class="assist"><a class="text-link" href="#forgot-password" id="forgot-link">Forgot Password?</a></div>
					<p class="message" id="form-message" role="alert"></p>
					<button class="submit" id="submit-button" type="submit">Sign In</button>
				</form>
				<p class="signup">Don't have an account? <a class="text-link" href="/signup" id="signup-link">Sign Up</a></p>
			</div>
		</section>
	</main>
	<script>
		const form = document.getElementById('signin-form');
		const email = document.getElementById('email');
		const password = document.getElementById('password');
		const submit = document.getElementById('submit-button');
		const toggle = document.getElementById('toggle-password');
		const setMessage = (id, text) => { document.getElementById(id).textContent = text; };
		const setInvalid = (id, invalid) => document.getElementById(id).classList.toggle('invalid', invalid);
		toggle.addEventListener('click', () => {
			const showing = password.type === 'text';
			password.type = showing ? 'password' : 'text';
			toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
			toggle.setAttribute('aria-pressed', String(!showing));
		});
		form.addEventListener('submit', async (event) => {
			event.preventDefault();
			setMessage('email-message', ''); setMessage('password-message', ''); setMessage('form-message', '');
			setInvalid('email-field', false); setInvalid('password-field', false);
			let valid = true;
			if (!email.value.trim()) { setMessage('email-message', 'Please enter your email.'); setInvalid('email-field', true); valid = false; }
			else if (!email.validity.valid) { setMessage('email-message', 'Please enter a valid email.'); setInvalid('email-field', true); valid = false; }
			if (!password.value) { setMessage('password-message', 'Please enter your password.'); setInvalid('password-field', true); valid = false; }
			if (!valid) return;
			try {
				const response = await fetch('/api/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email: email.value.trim(), password: password.value}) });
				const result = await response.json();
				if (!response.ok) setMessage('form-message', result.error || result.detail || 'Invalid email or password.');
				else window.location.href = result.redirect;
			} catch (_) { setMessage('form-message', 'Unable to sign in right now. Please try again.'); }
			finally { submit.disabled = false; submit.textContent = 'Sign In'; }
		});
		document.getElementById('forgot-link').addEventListener('click', (event) => { event.preventDefault(); setMessage('form-message', 'Please contact your HR administrator to reset your password.'); });
	</script>
</body>
</html>'''

# --- FastAPI routes (ASGI) -------------------------------------------------

@app.get('/', response_class=HTMLResponse)
async def get_root(request: Request):
	return HTMLResponse(content=PAGE)


@app.get('/signup', response_class=HTMLResponse)
async def get_signup(request: Request):
	if os.path.isfile('signup.html'):
		return FileResponse('signup.html', media_type='text/html')
	raise HTTPException(status_code=404)


@app.post('/api/login')
async def api_login(request: Request, response: Response):
	try:
		body = await request.json()
		email = str(body.get('email', '')).strip().lower()
		password = str(body.get('password', ''))
	except Exception:
		raise HTTPException(status_code=400, detail='Invalid request')
	if not email or not password:
		raise HTTPException(status_code=400, detail='Email and password are required')

	if supabase:
		try:
			auth_response = supabase.auth.sign_in_with_password({'email': email, 'password': password})
			session = getattr(auth_response, 'session', None)
			user = getattr(auth_response, 'user', None)
			access_token = getattr(session, 'access_token', None)
			if not user or not access_token:
				raise ValueError('Supabase did not return a session')
			metadata = getattr(user, 'app_metadata', {}) or {}
			role = metadata.get('role', 'employee')
			email = (getattr(user, 'email', email) or email).lower()
		except Exception:
			raise HTTPException(status_code=401, detail='Invalid email or password')
	else:
		user = USERS.get(email)
		if not user or user.get('password') != password or user.get('active') is False:
			raise HTTPException(status_code=401, detail='Invalid email or password')
		role = user.get('role', 'employee')
		access_token = email

	redirect = '/employee-dashboard' if role == 'employee' else '/admin-dashboard'
	result = JSONResponse({'redirect': redirect})
	result.set_cookie(key='session', value=access_token, path='/', httponly=True, samesite='lax', secure=bool(SUPABASE_URL))
	return result


@app.post('/api/signup')
async def api_signup(request: Request):
	try:
		body = await request.json()
		company = str(body.get('company', '')).strip()
		name = str(body.get('name', '')).strip()
		email = str(body.get('email', '')).strip().lower()
		phone = str(body.get('phone', '')).strip()
		password = str(body.get('password', ''))
		confirm_password = str(body.get('confirm_password', ''))
	except Exception:
		raise HTTPException(status_code=400, detail='Invalid request')
	if not company or not name or not email or not phone or not re.fullmatch(r'[^@\s]+@[^@\s]+\.[^@\s]+', email):
		raise HTTPException(status_code=400, detail='Please complete all fields')
	if not re.fullmatch(r'[+0-9()\-\s]{7,20}', phone):
		raise HTTPException(status_code=400, detail='Please enter a valid phone number')
	if not re.fullmatch(r'(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}', password):
		raise HTTPException(status_code=400, detail='Password must contain at least 8 characters, an uppercase letter, a lowercase letter, a number, and a special character')
	if password != confirm_password:
		raise HTTPException(status_code=400, detail='Passwords do not match.')
	if supabase:
		try:
			supabase.auth.sign_up({'email': email, 'password': password, 'options': {'data': {'name': name, 'company': company, 'phone': phone}, 'email_redirect_to': None}})
		except Exception:
			raise HTTPException(status_code=400, detail='Unable to create account. The email may already be registered.')
		return JSONResponse({'message': 'Account created successfully. Please verify your email to continue.'}, status_code=201)
	if email in USERS:
		raise HTTPException(status_code=409, detail='An account with this email already exists')
	USERS[email] = {'password': password, 'role': 'employee', 'active': True}
	EMPLOYEES[email] = {'profile': {'name': name, 'email': email, 'phone': phone, 'address': '', 'job_title': '', 'department': company}, 'attendance': [], 'leaves': [], 'payroll': {'salary': 0, 'currency': 'USD', 'last_payslip': None}}
	return JSONResponse({'message': 'Account created successfully. Please verify your email to continue.'}, status_code=201)


@app.get('/admin-spa')
async def get_admin_spa(request: Request):
	caller = _current_user_email_from_request(request)
	if not caller or caller not in USERS or USERS[caller].get('role') != 'hr':
		raise HTTPException(status_code=403)
	if os.path.isfile('admin_mockup.html'):
		return FileResponse('admin_mockup.html', media_type='text/html')
	raise HTTPException(status_code=500)


@app.get('/employee-spa')
async def get_employee_spa(request: Request):
	caller = _current_user_email_from_request(request)
	if not caller or caller not in USERS or USERS[caller].get('role') != 'employee':
		raise HTTPException(status_code=403)
	if os.path.isfile('employee_spa.html'):
		return FileResponse('employee_spa.html', media_type='text/html')
	raise HTTPException(status_code=500)


@app.get('/admin_styles.css')
async def get_admin_css():
	if os.path.isfile('admin_styles.css'):
		return FileResponse('admin_styles.css', media_type='text/css')
	raise HTTPException(status_code=404)


@app.get('/api/admin/users')
async def api_admin_users(request: Request):
	caller = _current_user_email_from_request(request)
	if not caller or caller not in USERS or USERS[caller].get('role') != 'hr':
		raise HTTPException(status_code=403)
	users = []
	for email, meta in USERS.items():
		entry = {'email': email, 'role': meta.get('role')}
		if email in EMPLOYEES:
			entry['profile'] = EMPLOYEES[email]['profile']
		users.append(entry)
	return JSONResponse(users)


@app.get('/api/admin/users/{target_email}')
async def api_admin_get_user(target_email: str, request: Request):
	caller = _current_user_email_from_request(request)
	if not caller or caller not in USERS or USERS[caller].get('role') != 'hr':
		raise HTTPException(status_code=403)
	if target_email not in USERS:
		raise HTTPException(status_code=404)
	resp = {'email': target_email, 'role': USERS[target_email].get('role')}
	if target_email in EMPLOYEES:
		resp.update({
			'profile': EMPLOYEES[target_email]['profile'],
			'attendance': EMPLOYEES[target_email]['attendance'],
			'leaves': EMPLOYEES[target_email]['leaves'],
			'payroll': EMPLOYEES[target_email]['payroll'],
		})
	return JSONResponse(resp)


@app.get('/api/admin/attendance')
async def api_admin_attendance(request: Request):
	caller = _current_user_email_from_request(request)
	if not caller or caller not in USERS or USERS[caller].get('role') != 'hr':
		raise HTTPException(status_code=403)
	summary = {e: EMPLOYEES[e]['attendance'] for e in EMPLOYEES}
	return JSONResponse(summary)


@app.get('/api/admin/leave/requests')
async def api_admin_leaves(request: Request):
	caller = _current_user_email_from_request(request)
	if not caller or caller not in USERS or USERS[caller].get('role') != 'hr':
		raise HTTPException(status_code=403)
	summary = {e: EMPLOYEES[e]['leaves'] for e in EMPLOYEES}
	return JSONResponse(summary)


@app.get('/api/admin/payroll/runs')
async def api_admin_payroll_runs(request: Request):
	caller = _current_user_email_from_request(request)
	if not caller or caller not in USERS or USERS[caller].get('role') != 'hr':
		raise HTTPException(status_code=403)
	return JSONResponse([])


@app.get('/api/profile')
async def api_profile(request: Request):
	email = _current_user_email_from_request(request)
	if not email or email not in EMPLOYEES:
		raise HTTPException(status_code=403)
	return JSONResponse(EMPLOYEES[email]['profile'])


@app.get('/api/attendance')
async def api_attendance(request: Request):
	email = _current_user_email_from_request(request)
	if not email or email not in EMPLOYEES:
		raise HTTPException(status_code=403)
	return JSONResponse(EMPLOYEES[email]['attendance'])


@app.get('/api/leave')
async def api_leave(request: Request):
	email = _current_user_email_from_request(request)
	if not email or email not in EMPLOYEES:
		raise HTTPException(status_code=403)
	return JSONResponse(EMPLOYEES[email]['leaves'])


@app.get('/api/payroll')
async def api_payroll(request: Request):
	email = _current_user_email_from_request(request)
	if not email or email not in EMPLOYEES:
		raise HTTPException(status_code=403)
	return JSONResponse(EMPLOYEES[email]['payroll'])


@app.post('/api/admin/users')
async def api_admin_create_user(request: Request):
	caller = _current_user_email_from_request(request)
	if not caller or caller not in USERS or USERS[caller].get('role') != 'hr':
		raise HTTPException(status_code=403)
	try:
		body = await request.json()
	except Exception:
		raise HTTPException(status_code=400)
	target = body.get('email', '').strip().lower()
	if not target:
		raise HTTPException(status_code=400, detail='missing email')
	if target in USERS:
		raise HTTPException(status_code=409, detail='user exists')
	USERS[target] = {'password': body.get('password', 'TempPass123'), 'role': body.get('role', 'employee')}
	if USERS[target]['role'] == 'employee':
		EMPLOYEES[target] = {'profile': {'name': body.get('first_name', '') + ' ' + body.get('last_name', ''), 'email': target, 'phone': body.get('phone', ''), 'address': body.get('address', ''), 'job_title': body.get('job_title', ''), 'department': body.get('department', '')}, 'attendance': [], 'leaves': [], 'payroll': {'salary': body.get('salary', 0), 'currency': body.get('currency', 'USD'), 'last_payslip': None}}
	return JSONResponse({'email': target, 'role': USERS[target]['role']}, status_code=201)


@app.post('/api/admin/users/{target}/deactivate')
async def api_admin_deactivate_user(target: str, request: Request):
	caller = _current_user_email_from_request(request)
	if not caller or caller not in USERS or USERS[caller].get('role') != 'hr':
		raise HTTPException(status_code=403)
	if target not in USERS:
		raise HTTPException(status_code=404)
	USERS[target]['active'] = False
	return JSONResponse({'email': target, 'active': False})


@app.post('/api/admin/users/{target}/update')
async def api_admin_update_user(target: str, request: Request):
	caller = _current_user_email_from_request(request)
	if not caller or caller not in USERS or USERS[caller].get('role') != 'hr':
		raise HTTPException(status_code=403)
	try:
		body = await request.json()
	except Exception:
		raise HTTPException(status_code=400)
	if 'role' in body:
		USERS[target]['role'] = body['role']
	if target in EMPLOYEES and 'profile' in body:
		EMPLOYEES[target]['profile'].update(body['profile'])
	return JSONResponse({'email': target})


@app.post('/api/profile')
async def api_profile_update(request: Request):
	email = _current_user_email_from_request(request)
	if not email or email not in EMPLOYEES:
		raise HTTPException(status_code=403)
	try:
		body = await request.json()
	except Exception:
		raise HTTPException(status_code=400)
	for k in ('phone', 'address'):
		if k in body:
			EMPLOYEES[email]['profile'][k] = body[k]
	return JSONResponse(EMPLOYEES[email]['profile'])


@app.post('/api/attendance/checkin')
async def api_attendance_checkin(request: Request):
	email = _current_user_email_from_request(request)
	if not email or email not in EMPLOYEES:
		raise HTTPException(status_code=403)
	today = date.today().isoformat()
	now = datetime.now(timezone.utc).isoformat()
	att = EMPLOYEES[email]['attendance']
	entry = next((x for x in att if x['date'] == today), None)
	if not entry:
		entry = {'date': today, 'checkin': now, 'checkout': None, 'status': 'Present'}
		att.append(entry)
	else:
		entry['checkin'] = now
	return JSONResponse(entry)


@app.post('/api/attendance/checkout')
async def api_attendance_checkout(request: Request):
	email = _current_user_email_from_request(request)
	if not email or email not in EMPLOYEES:
		raise HTTPException(status_code=403)
	today = date.today().isoformat()
	now = datetime.now(timezone.utc).isoformat()
	att = EMPLOYEES[email]['attendance']
	entry = next((x for x in att if x['date'] == today), None)
	if not entry:
		entry = {'date': today, 'checkin': None, 'checkout': now, 'status': 'Present'}
		att.append(entry)
	else:
		entry['checkout'] = now
	return JSONResponse(entry)


@app.post('/api/leave')
async def api_leave_create(request: Request):
	email = _current_user_email_from_request(request)
	if not email or email not in EMPLOYEES:
		raise HTTPException(status_code=403)
	try:
		body = await request.json()
	except Exception:
		raise HTTPException(status_code=400)
	leave = {
		'id': f"L{len(EMPLOYEES[email]['leaves'])+1}",
		'type': body.get('type', 'Unpaid'),
		'from': body.get('from'),
		'to': body.get('to'),
		'remarks': body.get('remarks', ''),
		'status': 'Pending',
	}
	EMPLOYEES[email]['leaves'].append(leave)
	return JSONResponse(leave, status_code=201)



class DayflowHandler(BaseHTTPRequestHandler):
		def _parse_cookies(self):
			raw = self.headers.get('Cookie', '')
			if not raw:
				return {}
			c = cookies.SimpleCookie()
			c.load(raw)
			return {k: v.value for k, v in c.items()}

		def _current_user_email(self):
			ck = self._parse_cookies()
			return ck.get('session')

		def _send_json(self, status, payload, extra_headers=None):
			body = json.dumps(payload).encode('utf-8')
			self.send_response(status)
			self.send_header('Content-Type', 'application/json')
			self.send_header('Content-Length', str(len(body)))
			if extra_headers:
				for k, v in extra_headers.items():
					self.send_header(k, v)
			self.end_headers()
			self.wfile.write(body)

		EMPLOYEE_DASH = r"""<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Employee Desk</title></head>
<body>
<h1>Employee Desk</h1>
<div id="cards">
<button id="profile">Profile</button>
<button id="attendance">Attendance</button>
<button id="leave">Leave Requests</button>
<button id="payroll">Payroll</button>
<button id="logout">Logout</button>
</div>
<div id="content"></div>
<script>
async function getJSON(path){const r=await fetch(path); if(!r.ok) throw r; return r.json();}
document.getElementById('profile').onclick=async()=>{ try{const p=await getJSON('/api/profile'); document.getElementById('content').innerHTML=`<pre>${JSON.stringify(p,0,2)}</pre>`;}catch(e){alert('Failed');}};
document.getElementById('attendance').onclick=async()=>{ try{const a=await getJSON('/api/attendance'); document.getElementById('content').innerHTML=`<pre>${JSON.stringify(a,0,2)}</pre>`;}catch(e){alert('Failed');}};
document.getElementById('leave').onclick=async()=>{ try{const l=await getJSON('/api/leave'); document.getElementById('content').innerHTML=`<pre>${JSON.stringify(l,0,2)}</pre>`;}catch(e){alert('Failed');}};
document.getElementById('payroll').onclick=async()=>{ try{const p=await getJSON('/api/payroll'); document.getElementById('content').innerHTML=`<pre>${JSON.stringify(p,0,2)}</pre>`;}catch(e){alert('Failed');}};
document.getElementById('logout').onclick=()=>{ document.cookie='session=; Path=/; Max-Age=0'; location='/'; };
</script></body></html>"""

		ADMIN_DASH = r"""<!doctype html>
<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin Desk</title></head>
<body>
<h1>Admin / HR Desk</h1>
<div id="cards">
<button id="users">Users</button>
<button id="attendance">Attendance</button>
<button id="leaves">Leaves</button>
<button id="payroll">Payroll</button>
<button id="reports">Reports</button>
<button id="logout">Logout</button>
</div>
<div id="content"></div>
<script>
async function getJSON(path){const r=await fetch(path,{credentials:'same-origin'}); if(!r.ok) throw r; return r.json();}
document.getElementById('users').onclick=async()=>{ try{const p=await getJSON('/api/admin/users'); document.getElementById('content').innerHTML=`<pre>${JSON.stringify(p,0,2)}</pre>`;}catch(e){alert('Failed');}};
document.getElementById('attendance').onclick=async()=>{ try{const a=await getJSON('/api/admin/attendance'); document.getElementById('content').innerHTML=`<pre>${JSON.stringify(a,0,2)}</pre>`;}catch(e){alert('Failed');}};
document.getElementById('leaves').onclick=async()=>{ try{const l=await getJSON('/api/admin/leave/requests'); document.getElementById('content').innerHTML=`<pre>${JSON.stringify(l,0,2)}</pre>`;}catch(e){alert('Failed');}};
document.getElementById('payroll').onclick=async()=>{ try{const p=await getJSON('/api/admin/payroll/runs'); document.getElementById('content').innerHTML=`<pre>${JSON.stringify(p,0,2)}</pre>`;}catch(e){alert('Failed');}};
document.getElementById('reports').onclick=async()=>{ document.getElementById('content').innerHTML='Reports UI (not implemented)'; };
document.getElementById('logout').onclick=()=>{ document.cookie='session=; Path=/; Max-Age=0'; location='/'; };
</script></body></html>"""

		def do_GET(self):
			path = urlparse(self.path).path
			if path == "/":
				body = PAGE.encode("utf-8")
				self.send_response(200)
				self.send_header("Content-Type", "text/html; charset=utf-8")
				self.send_header("Content-Length", str(len(body)))
				self.end_headers()
				self.wfile.write(body)
			elif path == "/employee-dashboard":
				email = self._current_user_email()
				if not email or email not in USERS or USERS[email]["role"] != "employee":
					self.send_error(403)
					return
				body = self.EMPLOYEE_DASH.encode('utf-8')
				self.send_response(200)
				self.send_header('Content-Type', 'text/html; charset=utf-8')
				self.send_header('Content-Length', str(len(body)))
				self.end_headers()
				self.wfile.write(body)
			elif path == "/admin-dashboard":
				email = self._current_user_email()
				if not email or email not in USERS or USERS[email].get('role') != 'hr':
					self.send_error(403)
					return
				body = self.ADMIN_DASH.encode('utf-8')
				self.send_response(200)
				self.send_header('Content-Type', 'text/html; charset=utf-8')
				self.send_header('Content-Length', str(len(body)))
				self.end_headers()
				self.wfile.write(body)
			elif path == '/admin-spa':
				# serve the admin mockup SPA from disk (requires HR role)
				email = self._current_user_email()
				if not email or email not in USERS or USERS[email].get('role') != 'hr':
					self.send_error(403)
					return
				try:
					with open('admin_mockup.html', 'rb') as f:
						body = f.read()
				except Exception:
					self.send_error(500)
					return
				self.send_response(200)
				self.send_header('Content-Type', 'text/html; charset=utf-8')
				self.send_header('Content-Length', str(len(body)))
				self.end_headers()
				self.wfile.write(body)
			elif path == '/employee-spa' or path == '/employee_spa.html' or path == '/employee_spa':
				# serve employee SPA (employee role required)
				email = self._current_user_email()
				if not email or email not in USERS or USERS[email].get('role') != 'employee':
					self.send_error(403)
					return
				try:
					with open('employee_spa.html', 'rb') as f:
						body = f.read()
				except Exception:
					self.send_error(500)
					return
				self.send_response(200)
				self.send_header('Content-Type', 'text/html; charset=utf-8')
				self.send_header('Content-Length', str(len(body)))
				self.end_headers()
				self.wfile.write(body)
			elif path == '/admin_styles.css':
				# serve CSS for the mockup
				try:
					with open('admin_styles.css', 'rb') as f:
						body = f.read()
				except Exception:
					self.send_error(500)
					return
				self.send_response(200)
				self.send_header('Content-Type', 'text/css; charset=utf-8')
				self.send_header('Content-Length', str(len(body)))
				self.end_headers()
				self.wfile.write(body)
			elif path.startswith('/api/'):
				# Admin APIs under /api/admin/*
				if path.startswith('/api/admin/'):
					# require hr role
					caller = self._current_user_email()
					if not caller or caller not in USERS or USERS[caller].get('role') != 'hr':
						self._send_json(403, {'error':'forbidden'})
						return
					parts = path.split('/')
					# GET /api/admin/users
					if path == '/api/admin/users':
						users = []
						for email, meta in USERS.items():
							entry = {'email': email, 'role': meta.get('role')}
							if email in EMPLOYEES:
								entry['profile'] = EMPLOYEES[email]['profile']
							users.append(entry)
						self._send_json(200, users)
						return
					# GET /api/admin/users/{email}
					if len(parts) >= 4 and parts[2] == 'admin' and parts[3] == 'users' and len(parts) == 5 and parts[4]:
						target = parts[4]
						if target not in USERS:
							self._send_json(404, {'error':'not found'})
							return
						resp = {'email': target, 'role': USERS[target].get('role')}
						if target in EMPLOYEES:
							resp['profile'] = EMPLOYEES[target]['profile']
							resp['attendance'] = EMPLOYEES[target]['attendance']
							resp['leaves'] = EMPLOYEES[target]['leaves']
							resp['payroll'] = EMPLOYEES[target]['payroll']
						self._send_json(200, resp)
						return
					# admin attendance and leave summaries (simple)
					if path == '/api/admin/attendance':
						summary = {e: EMPLOYEES[e]['attendance'] for e in EMPLOYEES}
						self._send_json(200, summary)
						return
					if path == '/api/admin/leave/requests':
						summary = {e: EMPLOYEES[e]['leaves'] for e in EMPLOYEES}
						self._send_json(200, summary)
						return
					if path == '/api/admin/payroll/runs':
						# placeholder: no payroll runs yet
						self._send_json(200, [])
						return
					self.send_error(404)
					return
				# API GETs: profile, attendance, leave, payroll
				email = self._current_user_email()
				if not email or email not in EMPLOYEES:
					self._send_json(403, {'error': 'Not authenticated'})
					return
				if path == '/api/profile':
					self._send_json(200, EMPLOYEES[email]['profile'])
				elif path == '/api/attendance':
					self._send_json(200, EMPLOYEES[email]['attendance'])
				elif path == '/api/leave':
					self._send_json(200, EMPLOYEES[email]['leaves'])
				elif path == '/api/payroll':
					self._send_json(200, EMPLOYEES[email]['payroll'])
				else:
					self.send_error(404)
			else:
				# Generic static file serving for other pages/assets (safe, simple)
				# don't attempt to serve /api/* here
				if path.startswith('/api/'):
					self.send_error(404)
					return
				file_path = path.lstrip('/') or 'index.html'
				# disallow path traversal
				if '..' in file_path or file_path.startswith('/'):
					self.send_error(400)
					return
				if os.path.isfile(file_path):
					ctype, _ = mimetypes.guess_type(file_path)
					ctype = ctype or 'application/octet-stream'
					try:
						with open(file_path, 'rb') as f:
							body = f.read()
					except Exception:
						self.send_error(500)
						return
					self.send_response(200)
					self.send_header('Content-Type', f"{ctype}; charset=utf-8")
					self.send_header('Content-Length', str(len(body)))
					self.end_headers()
					self.wfile.write(body)
				else:
					self.send_error(404)
				return

		def do_POST(self):
			path = urlparse(self.path).path
			if path == '/api/login':
				try:
					length = int(self.headers.get('Content-Length', '0'))
					credentials = json.loads(self.rfile.read(length))
					email = str(credentials.get('email', '')).strip().lower()
					password = str(credentials.get('password', ''))
				except (ValueError, json.JSONDecodeError, TypeError):
					self._send_json(400, {'error': 'Invalid request.'})
					return
				user = USERS.get(email)
				if not user or user['password'] != password:
					self._send_json(401, {'error': 'Invalid email or password.'})
					return
				redirect = '/employee-dashboard' if user['role'] == 'employee' else '/admin-dashboard'
				# set a simple session cookie (prototype only)
				extra = {'Set-Cookie': f'session={email}; Path=/; HttpOnly'}
				self._send_json(200, {'redirect': redirect}, extra_headers=extra)
				return
			# other POST API endpoints
			# Admin POST endpoints (HR role required)
			if path.startswith('/api/admin/'):
				caller = self._current_user_email()
				if not caller or caller not in USERS or USERS[caller].get('role') != 'hr':
					self._send_json(403, {'error':'forbidden'})
					return
				parts = path.split('/')
				# POST /api/admin/users -> create user
				if path == '/api/admin/users':
					try:
						length = int(self.headers.get('Content-Length','0'))
						body = json.loads(self.rfile.read(length))
					except Exception:
						self._send_json(400, {'error':'invalid request'})
						return
					target = body.get('email','').strip().lower()
					if not target:
						self._send_json(400, {'error':'missing email'})
						return
					if target in USERS:
						self._send_json(409, {'error':'user exists'})
						return
					USERS[target] = {'password': body.get('password','TempPass123'), 'role': body.get('role','employee')}
					if USERS[target]['role'] == 'employee':
						EMPLOYEES[target] = {'profile': {'name': body.get('first_name','') + ' ' + body.get('last_name',''), 'email': target, 'phone': body.get('phone',''), 'address': body.get('address',''), 'job_title': body.get('job_title',''), 'department': body.get('department','')}, 'attendance': [], 'leaves': [], 'payroll': {'salary': body.get('salary',0), 'currency': body.get('currency','USD'), 'last_payslip': None}}
					self._send_json(201, {'email': target, 'role': USERS[target]['role']})
					return
				# POST /api/admin/users/{email}/deactivate
				if len(parts) >= 6 and parts[2] == 'admin' and parts[3] == 'users' and parts[5] == 'deactivate':
					target = parts[4]
					if target not in USERS:
						self._send_json(404, {'error':'not found'})
						return
					USERS[target]['active'] = False
					self._send_json(200, {'email': target, 'active': False})
					return
				# POST /api/admin/users/{email}/update -> update basic fields
				if len(parts) >= 5 and parts[2] == 'admin' and parts[3] == 'users' and parts[4]:
					target = parts[4]
					try:
						length = int(self.headers.get('Content-Length','0'))
						body = json.loads(self.rfile.read(length))
					except Exception:
						self._send_json(400, {'error':'invalid request'})
						return
					# allow updating role or profile
					if 'role' in body:
						USERS[target]['role'] = body['role']
					if target in EMPLOYEES and 'profile' in body:
						EMPLOYEES[target]['profile'].update(body['profile'])
					self._send_json(200, {'email': target})
					return
			# fallback to employee-scoped endpoints
			email = self._current_user_email()
			if not email or email not in EMPLOYEES:
				self._send_json(403, {'error': 'Not authenticated'})
				return
			if path == '/api/profile':
				try:
					length = int(self.headers.get('Content-Length', '0'))
					body = json.loads(self.rfile.read(length))
				except Exception:
					self._send_json(400, {'error': 'Invalid request'})
					return
				# only allow limited edits
				for k in ('phone', 'address'):
					if k in body:
						EMPLOYEES[email]['profile'][k] = body[k]
				self._send_json(200, EMPLOYEES[email]['profile'])
				return
			if path == '/api/attendance/checkin':
				today = date.today().isoformat()
				now = datetime.now(timezone.utc).isoformat()
				att = EMPLOYEES[email]['attendance']
				entry = next((x for x in att if x['date'] == today), None)
				if not entry:
					entry = {'date': today, 'checkin': now, 'checkout': None, 'status': 'Present'}
					att.append(entry)
				else:
					entry['checkin'] = now
				self._send_json(200, entry)
				return
			if path == '/api/attendance/checkout':
				today = date.today().isoformat()
				now = datetime.now(timezone.utc).isoformat()
				att = EMPLOYEES[email]['attendance']
				entry = next((x for x in att if x['date'] == today), None)
				if not entry:
					entry = {'date': today, 'checkin': None, 'checkout': now, 'status': 'Present'}
					att.append(entry)
				else:
					entry['checkout'] = now
				self._send_json(200, entry)
				return
			if path == '/api/leave':
				try:
					length = int(self.headers.get('Content-Length', '0'))
					body = json.loads(self.rfile.read(length))
				except Exception:
					self._send_json(400, {'error': 'Invalid request'})
					return
				leave = {
					'id': f"L{len(EMPLOYEES[email]['leaves'])+1}",
					'type': body.get('type', 'Unpaid'),
					'from': body.get('from'),
					'to': body.get('to'),
					'remarks': body.get('remarks', ''),
					'status': 'Pending',
				}
				EMPLOYEES[email]['leaves'].append(leave)
				self._send_json(201, leave)
				return
			self.send_error(404)

		def log_message(self, format, *args):
			return



if __name__ == "__main__":
	import uvicorn
	uvicorn.run(app, host=HOST, port=PORT)

