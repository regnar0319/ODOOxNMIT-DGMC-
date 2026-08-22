from http.server import BaseHTTPRequestHandler, HTTPServer
import json
from urllib.parse import parse_qs, urlparse


HOST = "127.0.0.1"
PORT = 8000

# Demo identities keep the standalone prototype usable without a database.
USERS = {
		"employee@dayflow.com": {"password": "Employee@123", "role": "employee"},
		"hr@dayflow.com": {"password": "HrAdmin@123", "role": "hr"},
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
				<p class="signup">Don't have an account? <a class="text-link" href="#sign-up" id="signup-link">Sign Up</a></p>
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
			submit.disabled = true; submit.textContent = 'Signing In...';
			try {
				const response = await fetch('/api/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email: email.value.trim(), password: password.value}) });
				const result = await response.json();
				if (!response.ok) setMessage('form-message', result.error || 'Invalid email or password.');
				else window.location.href = result.redirect;
			} catch (_) { setMessage('form-message', 'Unable to sign in right now. Please try again.'); }
			finally { submit.disabled = false; submit.textContent = 'Sign In'; }
		});
		document.getElementById('forgot-link').addEventListener('click', (event) => { event.preventDefault(); setMessage('form-message', 'Please contact your HR administrator to reset your password.'); });
		document.getElementById('signup-link').addEventListener('click', (event) => { event.preventDefault(); setMessage('form-message', 'Account creation is managed by your Dayflow administrator.'); });
	</script>
</body>
</html>'''


class DayflowHandler(BaseHTTPRequestHandler):
		def do_GET(self):
				if urlparse(self.path).path == "/":
						body = PAGE.encode("utf-8")
						self.send_response(200)
						self.send_header("Content-Type", "text/html; charset=utf-8")
						self.send_header("Content-Length", str(len(body)))
						self.end_headers()
						self.wfile.write(body)
				else:
						self.send_error(404)

		def do_POST(self):
				if urlparse(self.path).path != "/api/login":
						self.send_error(404)
						return
				try:
						length = int(self.headers.get("Content-Length", "0"))
						credentials = json.loads(self.rfile.read(length))
						email = str(credentials.get("email", "")).strip().lower()
						password = str(credentials.get("password", ""))
				except (ValueError, json.JSONDecodeError, TypeError):
						self._json_response(400, {"error": "Invalid request."})
						return
				user = USERS.get(email)
				if not user or user["password"] != password:
						self._json_response(401, {"error": "Invalid email or password."})
						return
				redirect = "/employee-dashboard" if user["role"] == "employee" else "/admin-dashboard"
				self._json_response(200, {"redirect": redirect})

		def _json_response(self, status, payload):
				body = json.dumps(payload).encode("utf-8")
				self.send_response(status)
				self.send_header("Content-Type", "application/json")
				self.send_header("Content-Length", str(len(body)))
				self.end_headers()
				self.wfile.write(body)

		def log_message(self, format, *args):
				return


if __name__ == "__main__":
		print(f"Dayflow sign-in running at http://{HOST}:{PORT}")
		HTTPServer((HOST, PORT), DayflowHandler).serve_forever()
