const profileData = {
  name: 'Amelia Moore',
  loginId: 'EMP001',
  email: 'admin@company.com',
  phone: '+91 98765 43210',
  company: 'Dayflow Labs',
  department: 'Human Resources',
  manager: 'Daniel Sutton',
  location: 'Hyderabad, IN',
  about: 'Strategic HR leader with a focus on people operations, culture enablement, and operational excellence across growing organizations.',
  love: 'I enjoy shaping employee experience, improving processes, and helping teams grow with clarity, purpose, and support.',
  hobbies: 'Reading leadership journals, mentoring emerging professionals, walking in nature, and learning new productivity frameworks.'
};

const state = {
  currentView: 'profile',
  skills: ['Leadership', 'Communication', 'Team Management', 'HR Management'],
  certifications: [
    { name: 'SHRM-CP', organization: 'Society for Human Resource Management', date: '2024-02-22' },
    { name: 'Oracle HCM', organization: 'Oracle University', date: '2023-09-10' }
  ]
};

const pageContent = document.getElementById('page-content');
const breadcrumbLabel = document.getElementById('breadcrumb-label');
const pageTitle = document.getElementById('page-title');
const pageDescription = document.getElementById('page-description');
const editProfileButton = document.getElementById('edit-profile-button');
const secondaryActionButton = document.getElementById('header-secondary-action');

const viewMeta = {
  dashboard: { label: 'Dashboard', description: 'Monitor operations, attendance, and HR activity at a glance.' },
  profile: { label: 'My Profile', description: 'Keep your personal and professional information up to date.' },
  attendance: { label: 'Attendance', description: 'Track and manage employee attendance across the organization.' },
  timeoff: { label: 'Time Off', description: 'Manage leave requests and time-off balances for your team.' },
  payroll: { label: 'Payroll', description: 'Review compensation, payroll activity, and salary records.' },
  employees: { label: 'Employees', description: 'Manage your organization’s employee roster and team details.' }
};

function updateHeader(viewKey) {
  const meta = viewMeta[viewKey] || viewMeta.profile;
  breadcrumbLabel.textContent = meta.label;
  pageTitle.textContent = meta.label === 'My Profile' ? 'My profile' : meta.label;
  pageDescription.textContent = meta.description;

  document.querySelectorAll('.nav-item').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === viewKey);
  });

  if (viewKey === 'profile') {
    editProfileButton.textContent = 'Edit Profile';
    secondaryActionButton.textContent = 'Download';
  } else if (viewKey === 'employees') {
    editProfileButton.textContent = 'Add Employee';
    secondaryActionButton.textContent = 'Export';
  } else if (viewKey === 'attendance') {
    editProfileButton.textContent = 'Mark Attendance';
    secondaryActionButton.textContent = 'Filter';
  } else if (viewKey === 'timeoff') {
    editProfileButton.textContent = 'Apply Leave';
    secondaryActionButton.textContent = 'Download';
  } else if (viewKey === 'payroll') {
    editProfileButton.textContent = 'Run Payroll';
    secondaryActionButton.textContent = 'Reports';
  } else {
    editProfileButton.textContent = 'Quick Action';
    secondaryActionButton.textContent = 'Reports';
  }
}

function renderProfileView() {
  pageContent.innerHTML = `
    <section class="profile-summary card" aria-label="Profile summary">
      <div class="summary-main">
        <div class="profile-image-shell">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80" alt="Amelia Moore" />
          <button type="button" class="image-edit" id="image-edit-button" aria-label="Edit profile picture">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm14.71-9.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.47 1.47 3.75 3.75 1.47-1.47Z"/></svg>
          </button>
          <input id="profile-image-input" type="file" accept="image/*" hidden />
        </div>

        <div class="summary-meta">
          <div class="identity-line">
            <h2 id="profile-name">${profileData.name}</h2>
          </div>

          <div class="summary-details">
            <div class="meta-block">
              <span>Login ID</span>
              <strong id="login-id">${profileData.loginId}</strong>
            </div>
            <div class="meta-block">
              <span>Email</span>
              <strong><a href="mailto:${profileData.email}">${profileData.email}</a></strong>
            </div>
            <div class="meta-block">
              <span>Mobile</span>
              <strong>${profileData.phone}</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="summary-side">
        <div class="side-grid">
          <div class="meta-block"><span>Company</span><strong>${profileData.company}</strong></div>
          <div class="meta-block"><span>Department</span><strong>${profileData.department}</strong></div>
          <div class="meta-block"><span>Manager</span><strong>${profileData.manager}</strong></div>
          <div class="meta-block"><span>Location</span><strong>${profileData.location}</strong></div>
        </div>
      </div>
    </section>

    <nav class="tab-bar" aria-label="Profile tabs">
      <button type="button" class="tab active" data-panel="resume-panel">Resume</button>
      <button type="button" class="tab" data-panel="private-panel">Private Info</button>
      <button type="button" class="tab" data-panel="salary-panel">Salary Info</button>
    </nav>

    <section class="tab-panel active" id="resume-panel">
      <div class="resume-grid">
        <div class="resume-column">
          <article class="content-card">
            <div class="card-header">
              <h3>About</h3>
              <button type="button" class="ghost-icon" data-edit="about" aria-label="Edit about section">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm14.71-9.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.47 1.47 3.75 3.75 1.47-1.47Z"/></svg>
              </button>
            </div>
            <p id="about-text">${profileData.about}</p>
          </article>

          <article class="content-card">
            <div class="card-header">
              <h3>What I love about my job</h3>
              <button type="button" class="ghost-icon" data-edit="love" aria-label="Edit job likes">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm14.71-9.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.47 1.47 3.75 3.75 1.47-1.47Z"/></svg>
              </button>
            </div>
            <p id="love-text">${profileData.love}</p>
          </article>

          <article class="content-card">
            <div class="card-header">
              <h3>My interests and hobbies</h3>
              <button type="button" class="ghost-icon" data-edit="hobbies" aria-label="Edit hobbies">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm14.71-9.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.47 1.47 3.75 3.75 1.47-1.47Z"/></svg>
              </button>
            </div>
            <p id="hobbies-text">${profileData.hobbies}</p>
          </article>
        </div>

        <div class="resume-column">
          <article class="content-card">
            <div class="card-header">
              <h3>Skills</h3>
              <button type="button" class="link-button" id="add-skill-button">+ Add Skills</button>
            </div>
            <div class="skill-list" id="skill-list"></div>
          </article>

          <article class="content-card">
            <div class="card-header">
              <h3>Certification</h3>
              <button type="button" class="link-button" id="add-cert-button">+ Add Certification</button>
            </div>
            <div class="cert-list" id="cert-list"></div>
          </article>
        </div>
      </div>
    </section>

    <section class="tab-panel" id="private-panel">
      <div class="private-card card">
        <div class="card-header single-row">
          <h3>Private Information</h3>
          <button type="button" class="secondary-button" id="private-edit-button">Edit Profile</button>
        </div>

        <div class="private-grid">
          <div class="private-item"><span>Personal phone</span><strong id="private-phone">${profileData.phone}</strong></div>
          <div class="private-item"><span>Address</span><strong id="private-address">14 Orchid Avenue, Banjara Hills, Hyderabad</strong></div>
          <div class="private-item"><span>Emergency contact</span><strong id="private-emergency">Ravi Moore · +91 98450 77111</strong></div>
          <div class="private-item"><span>Personal information</span><strong id="private-notes">Married, Indian national, residing in Hyderabad.</strong></div>
        </div>
      </div>
    </section>

    <section class="tab-panel" id="salary-panel">
      <div class="salary-card card">
        <div class="card-header single-row">
          <h3>Salary Overview</h3>
          <span class="status-badge">Restricted</span>
        </div>

        <div class="salary-grid">
          <div class="salary-item"><span>Salary structure</span><strong>Annual CTC</strong></div>
          <div class="salary-item"><span>Basic salary</span><strong>₹18,00,000</strong></div>
          <div class="salary-item"><span>Allowances</span><strong>₹2,40,000</strong></div>
          <div class="salary-item"><span>Deductions</span><strong>₹1,10,000</strong></div>
          <div class="salary-item"><span>Net salary</span><strong>₹19,30,000</strong></div>
          <div class="salary-item"><span>Salary effective date</span><strong>01 Aug 2026</strong></div>
        </div>
      </div>
    </section>
  `;

  renderSkills();
  renderCerts();
  attachProfileListeners();
}

function renderDashboardView() {
  pageContent.innerHTML = `
    <div class="stats-grid">
      <article class="metric-card card"><span>Total Employees</span><strong>2,480</strong><small>+8.4% vs last month</small></article>
      <article class="metric-card card"><span>Present Today</span><strong>1,962</strong><small>79.1% attendance rate</small></article>
      <article class="metric-card card"><span>On Leave</span><strong>128</strong><small>14 pending approvals</small></article>
      <article class="metric-card card"><span>Pending Requests</span><strong>32</strong><small>8 payroll approvals</small></article>
    </div>

    <div class="dashboard-grid">
      <section class="card panel-card">
        <div class="panel-header">
          <h3>Attendance Overview</h3>
          <span class="status-badge success">Active</span>
        </div>
        <div class="chart-bars">
          <span style="height:58%"></span>
          <span style="height:64%"></span>
          <span style="height:74%"></span>
          <span style="height:60%"></span>
          <span style="height:82%"></span>
          <span style="height:91%"></span>
          <span style="height:77%"></span>
        </div>
      </section>

      <section class="card panel-card">
        <div class="panel-header">
          <h3>Leave Requests</h3>
          <button type="button" class="link-button">View all</button>
        </div>
        <ul class="list-stack">
          <li><span>Amara Yusuf</span><strong>Annual Leave</strong><em class="pending">Pending</em></li>
          <li><span>Victor James</span><strong>Sick Leave</strong><em class="approved">Approved</em></li>
          <li><span>Luke Green</span><strong>Personal Time</strong><em class="rejected">Rejected</em></li>
        </ul>
      </section>

      <section class="card panel-card wide">
        <div class="panel-header">
          <h3>Recent Activity</h3>
          <button type="button" class="link-button">Open log</button>
        </div>
        <ul class="activity-list">
          <li><strong>Payroll cycle published</strong><span>09:22 AM · Today</span></li>
          <li><strong>Leave request approved</strong><span>08:15 AM · Today</span></li>
          <li><strong>Employee profile updated</strong><span>Yesterday · 2:40 PM</span></li>
          <li><strong>Schedule changed for finance team</strong><span>Yesterday · 10:05 AM</span></li>
        </ul>
      </section>
    </div>
  `;
}

function renderAttendanceView() {
  pageContent.innerHTML = `
    <section class="card panel-card table-card">
      <div class="panel-header">
        <div>
          <h3>Attendance Records</h3>
          <small>Track and manage employee attendance.</small>
        </div>
        <button type="button" class="secondary-button">Filter</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Employee</th><th>Date</th><th>Check-in</th><th>Check-out</th><th>Hours</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Amelia Moore</td><td>22 Aug 2026</td><td>08:52</td><td>17:34</td><td>8.7h</td><td><span class="pill success">Present</span></td></tr>
            <tr><td>Rita Patel</td><td>22 Aug 2026</td><td>09:10</td><td>18:02</td><td>8.8h</td><td><span class="pill success">Present</span></td></tr>
            <tr><td>Daniel Reed</td><td>22 Aug 2026</td><td>—</td><td>—</td><td>0h</td><td><span class="pill danger">Absent</span></td></tr>
            <tr><td>Grace Kim</td><td>22 Aug 2026</td><td>09:04</td><td>13:10</td><td>4.1h</td><td><span class="pill warning">Half-day</span></td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderTimeOffView() {
  pageContent.innerHTML = `
    <div class="two-col-grid">
      <section class="card panel-card">
        <div class="panel-header">
          <h3>Leave Balance</h3>
          <button type="button" class="primary-button">Apply Leave</button>
        </div>
        <div class="mini-stats">
          <div><span>Paid</span><strong>14 Days</strong></div>
          <div><span>Sick</span><strong>7 Days</strong></div>
          <div><span>Unpaid</span><strong>3 Days</strong></div>
        </div>
      </section>

      <section class="card panel-card">
        <div class="panel-header"><h3>Requests</h3></div>
        <ul class="list-stack">
          <li><span>Annual Leave</span><strong>14 Aug</strong><em class="pending">Pending</em></li>
          <li><span>Sick Leave</span><strong>09 Aug</strong><em class="approved">Approved</em></li>
          <li><span>Personal Leave</span><strong>02 Aug</strong><em class="rejected">Rejected</em></li>
        </ul>
      </section>
    </div>
  `;
}

function renderPayrollView() {
  pageContent.innerHTML = `
    <div class="two-col-grid">
      <section class="card panel-card">
        <div class="panel-header">
          <h3>Salary Summary</h3>
          <span class="status-badge success">Updated</span>
        </div>
        <div class="mini-stats">
          <div><span>Basic Salary</span><strong>₹18,00,000</strong></div>
          <div><span>Allowances</span><strong>₹2,40,000</strong></div>
          <div><span>Deductions</span><strong>₹1,10,000</strong></div>
          <div><span>Net Salary</span><strong>₹19,30,000</strong></div>
        </div>
      </section>

      <section class="card panel-card">
        <div class="panel-header"><h3>Salary History</h3></div>
        <ul class="list-stack">
          <li><span>Aug 2026</span><strong>₹1,61,000</strong><em class="approved">Paid</em></li>
          <li><span>Jul 2026</span><strong>₹1,61,000</strong><em class="approved">Paid</em></li>
          <li><span>Jun 2026</span><strong>₹1,61,000</strong><em class="approved">Paid</em></li>
        </ul>
      </section>
    </div>
  `;
}

function renderEmployeesView() {
  pageContent.innerHTML = `
    <section class="card panel-card table-card">
      <div class="panel-header">
        <div>
          <h3>Employees</h3>
          <small>Manage your organization’s employee roster.</small>
        </div>
        <button type="button" class="primary-button">Add Employee</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Employee</th><th>ID</th><th>Department</th><th>Designation</th><th>Email</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr><td>Amelia Moore</td><td>EMP001</td><td>Human Resources</td><td>HR Manager</td><td>admin@company.com</td><td><span class="pill success">Active</span></td><td><button type="button" class="table-action">View</button></td></tr>
            <tr><td>Rita Patel</td><td>EMP012</td><td>Finance</td><td>Accountant</td><td>rita.patel@company.com</td><td><span class="pill success">Active</span></td><td><button type="button" class="table-action">View</button></td></tr>
            <tr><td>Daniel Reed</td><td>EMP042</td><td>Operations</td><td>Supervisor</td><td>daniel.reed@company.com</td><td><span class="pill danger">Inactive</span></td><td><button type="button" class="table-action">View</button></td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderView(viewKey) {
  state.currentView = viewKey;
  updateHeader(viewKey);

  if (viewKey === 'dashboard') renderDashboardView();
  else if (viewKey === 'attendance') renderAttendanceView();
  else if (viewKey === 'timeoff') renderTimeOffView();
  else if (viewKey === 'payroll') renderPayrollView();
  else if (viewKey === 'employees') renderEmployeesView();
  else renderProfileView();
}

function renderSkills() {
  const container = document.getElementById('skill-list');
  if (!container) return;

  if (!state.skills.length) {
    container.innerHTML = '<div class="empty-state">No skills added yet.</div>';
    return;
  }

  container.innerHTML = state.skills.map((skill, index) => `
    <div class="skill-tag">
      <span>${skill}</span>
      <button type="button" class="remove-chip" data-remove-skill="${index}" aria-label="Remove ${skill}">×</button>
    </div>
  `).join('');
}

function renderCerts() {
  const container = document.getElementById('cert-list');
  if (!container) return;

  if (!state.certifications.length) {
    container.innerHTML = '<div class="empty-state">No certifications added yet.</div>';
    return;
  }

  container.innerHTML = state.certifications.map((cert, index) => `
    <div class="cert-item">
      <div class="cert-body">
        <strong>${cert.name}</strong>
        <span>${cert.organization}</span>
        <span>${new Date(cert.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      </div>
      <button type="button" class="cert-delete" data-remove-cert="${index}" aria-label="Delete certification">×</button>
    </div>
  `).join('');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove('show'), 2000);
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.remove('hidden');
  document.getElementById('modal-backdrop').classList.remove('hidden');
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.add('hidden');
  const remainingOpen = document.querySelector('.modal:not(.hidden)');
  if (!remainingOpen) document.getElementById('modal-backdrop').classList.add('hidden');
}

function syncProfileFields(formData) {
  profileData.name = formData.get('fullName');
  profileData.loginId = formData.get('loginId');
  profileData.email = formData.get('email');
  profileData.phone = formData.get('mobile');
  profileData.company = formData.get('company');
  profileData.department = formData.get('department');
  profileData.manager = formData.get('manager');
  profileData.location = formData.get('location');
  profileData.about = formData.get('about');
  profileData.love = formData.get('love');
  profileData.hobbies = formData.get('hobbies');

  const nameNode = document.getElementById('profile-name');
  if (nameNode) nameNode.textContent = profileData.name;
  const fullNameHeader = document.querySelector('.profile-name');
  if (fullNameHeader) fullNameHeader.textContent = profileData.name;

  const loginIdNode = document.getElementById('login-id');
  if (loginIdNode) loginIdNode.textContent = profileData.loginId;

  const emailAnchor = document.querySelector('.meta-block a');
  if (emailAnchor) {
    emailAnchor.textContent = profileData.email;
    emailAnchor.setAttribute('href', `mailto:${profileData.email}`);
  }

  const privatePhone = document.getElementById('private-phone');
  if (privatePhone) privatePhone.textContent = profileData.phone;

  const aboutText = document.getElementById('about-text');
  if (aboutText) aboutText.textContent = profileData.about;

  const loveText = document.getElementById('love-text');
  if (loveText) loveText.textContent = profileData.love;

  const hobbiesText = document.getElementById('hobbies-text');
  if (hobbiesText) hobbiesText.textContent = profileData.hobbies;

  const sideMeta = document.querySelectorAll('.summary-side .meta-block strong');
  if (sideMeta.length >= 4) {
    sideMeta[0].textContent = profileData.company;
    sideMeta[1].textContent = profileData.department;
    sideMeta[2].textContent = profileData.manager;
    sideMeta[3].textContent = profileData.location;
  }
}

function attachProfileListeners() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((button) => {
        button.classList.toggle('active', button === tab);
      });

      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.classList.toggle('active', panel.id === tab.dataset.panel);
      });
    });
  });

  document.querySelectorAll('[data-edit]').forEach((button) => {
    button.addEventListener('click', () => openModal(document.getElementById('profile-modal')));
  });

  document.getElementById('private-edit-button')?.addEventListener('click', () => openModal(document.getElementById('profile-modal')));
  document.getElementById('edit-profile-button')?.addEventListener('click', () => openModal(document.getElementById('profile-modal')));
  document.getElementById('add-skill-button')?.addEventListener('click', () => openModal(document.getElementById('skill-modal')));
  document.getElementById('add-cert-button')?.addEventListener('click', () => openModal(document.getElementById('cert-modal')));
  document.getElementById('image-edit-button')?.addEventListener('click', () => document.getElementById('profile-image-input').click());

  document.getElementById('skill-list')?.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-remove-skill]');
    if (!trigger) return;
    state.skills.splice(Number(trigger.dataset.removeSkill), 1);
    renderSkills();
  });

  document.getElementById('cert-list')?.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-remove-cert]');
    if (!trigger) return;
    state.certifications.splice(Number(trigger.dataset.removeCert), 1);
    renderCerts();
  });

  document.getElementById('profile-image-input')?.addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const image = document.querySelector('.profile-image-shell img');
      if (image) image.src = loadEvent.target.result;
      showToast('Profile picture updated successfully.');
    };
    reader.readAsDataURL(file);
  });
}

document.getElementById('profile-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  syncProfileFields(formData);
  closeModal(document.getElementById('profile-modal'));
  showToast('Profile updated successfully.');
});

document.getElementById('skill-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = event.currentTarget.skill.value.trim();
  if (!value) return;
  state.skills.push(value);
  renderSkills();
  event.currentTarget.reset();
  closeModal(document.getElementById('skill-modal'));
  showToast('Skill added successfully.');
});

document.getElementById('cert-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const cert = {
    name: form.name.value.trim(),
    organization: form.organization.value.trim(),
    date: form.date.value
  };

  if (!cert.name || !cert.organization || !cert.date) return;
  state.certifications.push(cert);
  renderCerts();
  form.reset();
  closeModal(document.getElementById('cert-modal'));
  showToast('Certification added successfully.');
});

document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', () => renderView(button.dataset.view));
});

document.querySelector('.profile-trigger')?.addEventListener('click', () => {
  document.querySelector('.profile-menu-wrap').classList.toggle('open');
});

window.addEventListener('click', (event) => {
  const profileWrap = document.querySelector('.profile-menu-wrap');
  if (profileWrap && !profileWrap.contains(event.target)) {
    profileWrap.classList.remove('open');
  }

  if (event.target === document.getElementById('modal-backdrop')) {
    closeModal(document.getElementById('profile-modal'));
    closeModal(document.getElementById('skill-modal'));
    closeModal(document.getElementById('cert-modal'));
  }
});

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => {
    const modal = document.getElementById(button.dataset.close);
    closeModal(modal);
  });
});

renderView('profile');
