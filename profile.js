const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
const modal = document.querySelector('#edit-modal');
const photoInput = document.querySelector('#photo-input');

function showTab(id) {
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === id));
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === id));
}

tabs.forEach((tab) => tab.addEventListener('click', () => showTab(tab.dataset.tab)));
document.querySelectorAll('[data-tab-link]').forEach((link) => link.addEventListener('click', () => showTab(link.dataset.tabLink)));

document.querySelectorAll('[data-open-edit]').forEach((button) => button.addEventListener('click', () => {
  modal.classList.add('open');
  document.querySelector('#edit-email').focus();
}));
document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => modal.classList.remove('open')));
modal.addEventListener('click', (event) => { if (event.target === modal) modal.classList.remove('open'); });
document.querySelector('#edit-form').addEventListener('submit', (event) => {
  event.preventDefault();
  modal.classList.remove('open');
  window.alert('Your profile changes have been saved.');
});

document.querySelectorAll('[data-photo-input]').forEach((button) => button.addEventListener('click', () => photoInput.click()));
photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const photo = document.querySelector('#profile-photo');
    photo.style.backgroundImage = `url(${reader.result})`;
    photo.style.backgroundSize = 'cover';
    photo.textContent = '';
  });
  reader.readAsDataURL(file);
});

document.querySelector('#resume-download').addEventListener('click', () => window.alert('Resume download started.'));
document.querySelector('#upload-document').addEventListener('click', () => document.querySelector('#document-input').click());
document.querySelector('#document-input').addEventListener('change', (event) => {
  if (event.target.files[0]) window.alert(`${event.target.files[0].name} is ready to upload.`);
});

document.querySelectorAll('#skills .tag button').forEach((button) => button.addEventListener('click', () => button.parentElement.remove()));
document.querySelector('#add-skill').addEventListener('click', () => {
  const skill = window.prompt('Add a skill');
  if (!skill || !skill.trim()) return;
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.innerHTML = `${skill.trim()} <button aria-label="Remove skill">×</button>`;
  tag.querySelector('button').addEventListener('click', () => tag.remove());
  document.querySelector('#skills').append(tag);
});
document.querySelector('#add-experience').addEventListener('click', () => window.alert('Experience entry form opened for your next role.'));
document.querySelector('#add-education').addEventListener('click', () => window.alert('Education entry form opened.'));
