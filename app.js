const form = document.querySelector('#auth-form');
const alertBox = document.querySelector('#alert');
const submitButton = document.querySelector('#submit-button');
const submitLabel = document.querySelector('#submit-label');

function clearFeedback() {
  alertBox.className = 'alert';
  alertBox.textContent = '';
  document.querySelectorAll('.has-error').forEach((field) => field.classList.remove('has-error'));
  document.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
}

function showAlert(message, type) {
  alertBox.textContent = message;
  alertBox.className = `alert show ${type}`;
}

function setFieldError(input, message) {
  const field = input.closest('.field');
  field.classList.add('has-error');
  field.querySelector('.field-error').textContent = message;
}

function validate() {
  clearFeedback();
  let valid = true;
  const employeeId = document.querySelector('#employee-id');
  const password = document.querySelector('#password');
  if (!employeeId.value.trim()) { setFieldError(employeeId, 'Enter your Employee ID.'); valid = false; }
  if (!password.value) { setFieldError(password, 'Enter your password.'); valid = false; }
  return valid;
}

document.querySelectorAll('.password-toggle').forEach((button) => button.addEventListener('click', () => {
  const input = document.querySelector(`#${button.dataset.target}`);
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  button.classList.toggle('is-visible', !visible);
  button.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
}));
document.querySelector('#forgot-link').addEventListener('click', (event) => { event.preventDefault(); showAlert('Password reset instructions will be sent if this Employee ID belongs to a Dayflow workspace.', 'success'); });
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validate()) return;
  submitButton.disabled = true;
  submitButton.classList.add('is-loading');
  window.setTimeout(() => {
    submitButton.disabled = false;
    submitButton.classList.remove('is-loading');
    showAlert('Invalid Employee ID or password.', 'error');
  }, 850);
});
