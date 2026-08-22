const form = document.querySelector('.auth-form');
const statusBox = document.querySelector('[data-status]');
const pageType = document.body.dataset.page;

function setStatus(message, type = 'error') {
    statusBox.textContent = message;
    statusBox.className = `form-status show ${type}`;
}

function clearStatus() {
    statusBox.textContent = '';
    statusBox.className = 'form-status';
}

function setFieldError(field, message = '') {
    const input = form.elements[field];
    const wrap = input?.closest('.input-wrap');
    const error = input?.closest('.field')?.querySelector('.field-error');
    wrap?.classList.toggle('invalid', Boolean(message));
    if (error) error.textContent = message;
}

function togglePassword(event) {
    const button = event.currentTarget;
    const input = form.elements[button.dataset.target];
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    button.textContent = input.type === 'password' ? 'Show' : 'Hide';
    button.setAttribute('aria-label', `${input.type === 'password' ? 'Show' : 'Hide'} ${button.dataset.target}`);
}

document.querySelectorAll('.password-toggle').forEach((button) => button.addEventListener('click', togglePassword));

document.querySelector('[data-forgot]')?.addEventListener('click', (event) => {
    event.preventDefault();
    setStatus('Please contact your HR administrator to reset your password.');
});

function updatePasswordMeter() {
    const password = form.elements.password?.value || '';
    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[^A-Za-z\d]/.test(password)
    };
    document.querySelectorAll('[data-requirement]').forEach((item) => item.classList.toggle('valid', checks[item.dataset.requirement]));
    const score = Object.values(checks).filter(Boolean).length;
    const meter = document.querySelector('.meter-fill');
    if (meter) {
        meter.style.width = `${score * 20}%`;
        meter.style.background = score >= 4 ? 'var(--success)' : 'var(--error)';
    }
}
form.elements.password?.addEventListener('input', updatePasswordMeter);

function validateSignIn() {
    let valid = true;
    clearStatus();
    if (!form.elements.email.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.elements.email.value)) {
        setFieldError('email', 'Enter a valid work email.'); valid = false;
    } else setFieldError('email');
    if (!form.elements.password.value) { setFieldError('password', 'Password is required.'); valid = false; } else setFieldError('password');
    return valid;
}

function validateSignUp() {
    let valid = true;
    clearStatus();
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    const checks = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (!form.elements.employee_id.value.trim()) { setFieldError('employee_id', 'Employee ID is required.'); valid = false; } else setFieldError('employee_id');
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setFieldError('email', 'Enter a valid work email.'); valid = false; } else setFieldError('email');
    if (!checks.test(password)) { setFieldError('password', "Password doesn't meet the security requirements."); valid = false; } else setFieldError('password');
    if (form.elements.confirm_password.value !== password) { setFieldError('confirm_password', "Passwords don't match."); valid = false; } else setFieldError('confirm_password');
    if (!form.elements.terms.checked) { setStatus('Please accept the Terms & Conditions to continue.'); valid = false; }
    return valid;
}

function showVerification(email) {
    document.querySelector('.auth-card').innerHTML = `<div class="verification">
    <div class="verification-icon" aria-hidden="true">✓</div>
    <h3>Check your email</h3>
    <p>We've sent a verification link to your email address.</p>
    <div class="email-chip">${email.replace(/[&<>\"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]))}</div>
    <div class="verification-actions">
            <a class="primary-action" href="mailto:${encodeURIComponent(email)}" style="display:grid;place-items:center;text-decoration:none">Open Email</a>
      <button class="primary-action" type="button" data-resend>Resend Email</button>
      <a class="secondary-action" href="/" style="display:grid;place-items:center;text-decoration:none">Back to Sign In</a>
    </div>
    <p>Didn't receive it? <button type="button" class="text-link" data-resend-inline>Resend</button></p>
  </div>`;
    let cooldown = 0;
    const resend = () => {
        if (cooldown) return;
        cooldown = 30;
        setResendText();
        const timer = setInterval(() => { cooldown -= 1; setResendText(); if (!cooldown) clearInterval(timer); }, 1000);
    };
    const setResendText = () => document.querySelectorAll('[data-resend], [data-resend-inline]').forEach((button) => { button.textContent = cooldown ? `Resend in ${cooldown}s` : 'Resend Email'; button.disabled = Boolean(cooldown); });
    document.querySelectorAll('[data-resend], [data-resend-inline]').forEach((button) => button.addEventListener('click', resend));
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const valid = pageType === 'signin' ? validateSignIn() : validateSignUp();
    if (!valid) return;
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    button.textContent = pageType === 'signin' ? 'Signing in...' : 'Creating account...';
    const payload = pageType === 'signin'
        ? { email: form.elements.email.value.trim(), password: form.elements.password.value }
        : { employee_id: form.elements.employee_id.value.trim(), email: form.elements.email.value.trim(), password: form.elements.password.value, confirm_password: form.elements.confirm_password.value, role: form.elements.role.value, name: form.elements.employee_id.value.trim(), company: 'Dayflow', phone: 'Not provided' };
    try {
        const response = await fetch(pageType === 'signin' ? '/api/login' : '/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.detail || 'Unable to create your account. Please try again.');
        if (pageType === 'signin') window.location.href = data.redirect || '/employee-spa';
        else showVerification(payload.email);
    } catch (error) {
        setStatus(pageType === 'signin' ? 'Incorrect email or password.' : 'Unable to create your account. Please try again.');
        button.disabled = false;
        button.textContent = pageType === 'signin' ? 'Sign In' : 'Create Account';
    }
});
