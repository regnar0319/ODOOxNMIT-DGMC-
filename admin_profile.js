const tabs = document.querySelectorAll('.tabs button');
const panels = document.querySelectorAll('.panel');
const modal = document.querySelector('#edit-modal');
const photoInput = document.querySelector('#photo-input');
const resumeInput = document.querySelector('#resume-input');
const documentInput = document.querySelector('#document-input');

document.querySelectorAll('.edit-tabs button').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('.edit-tabs button').forEach((item) => item.classList.toggle('active', item === tab));
}));

function showTab(id) {
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === id));
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === id));
}
tabs.forEach((tab) => tab.addEventListener('click', () => showTab(tab.dataset.tab)));
document.querySelectorAll('[data-tab-link]').forEach((link) => link.addEventListener('click', () => showTab(link.dataset.tabLink)));

document.querySelectorAll('[data-edit]').forEach((button) => button.addEventListener('click', () => modal.classList.add('open')));
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => modal.classList.remove('open')));
modal.addEventListener('click', (event) => { if (event.target === modal) modal.classList.remove('open'); });
document.querySelector('#edit-form').addEventListener('submit', (event) => { event.preventDefault(); modal.classList.remove('open'); window.alert('Profile updated successfully.'); });

document.querySelectorAll('[data-photo]').forEach((button) => button.addEventListener('click', () => photoInput.click()));
photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file) return;
  if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 5 * 1024 * 1024) return window.alert('Please choose a PNG or JPG image under 5 MB.');
  const reader = new FileReader();
  reader.addEventListener('load', () => { const photo = document.querySelector('#photo'); photo.style.background = `url(${reader.result}) center / cover`; photo.textContent = ''; });
  reader.readAsDataURL(file);
});

function selectFile(input, label) {
  input.click();
  input.onchange = () => { if (input.files[0]) window.alert(`${label}: ${input.files[0].name} is ready to upload.`); };
}
document.querySelector('#resume-upload').addEventListener('click', () => selectFile(resumeInput, 'Resume'));
document.querySelector('#resume-drop').addEventListener('click', () => selectFile(resumeInput, 'Resume'));
document.querySelector('#document-upload').addEventListener('click', () => selectFile(documentInput, 'Document'));
document.querySelector('#resume-view').addEventListener('click', () => window.alert('Resume preview opened in a secure viewer.'));
document.querySelector('#resume-download').addEventListener('click', () => window.alert('Resume download started.'));

document.querySelectorAll('[data-reveal]').forEach((button) => button.addEventListener('click', () => {
  const label = button.dataset.reveal;
  if (window.confirm(`Reveal ${label}? This sensitive value will be visible temporarily.`)) window.alert(`${label}: XXXX XXXX 4821`);
}));
document.querySelectorAll('.tags button').forEach((button) => button.addEventListener('click', () => button.parentElement.remove()));
document.querySelector('#add-skill').addEventListener('click', () => {
  const value = window.prompt('Add a skill');
  if (!value || !value.trim()) return;
  const tag = document.createElement('span'); tag.innerHTML = `${value.trim()} <button aria-label="Remove skill">×</button>`;
  tag.querySelector('button').addEventListener('click', () => tag.remove()); document.querySelector('#skills').append(tag);
});
document.querySelectorAll('.delete').forEach((button) => button.addEventListener('click', () => { if (window.confirm('Delete this document? This action will be logged.')) button.closest('.file').remove(); }));
