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
  ],
  employees: [
    { id: 1, name: 'Amara Mensah', employeeId: 'DF-2040', department: 'Design & Experience', designation: 'Product Designer', email: 'amara.mensah@dayflow.com', status: 'Active', joined: '2022-03-14', phone: '+91 98765 43210', manager: 'Riya Kapoor', location: 'Bengaluru, IN', avatar: 'AM' },
    { id: 2, name: 'Daniel Reed', employeeId: 'DF-8812', department: 'Engineering', designation: 'Frontend Engineer', email: 'daniel.reed@dayflow.com', status: 'On Leave', joined: '2021-06-08', phone: '+91 98450 77111', manager: 'Sonia Mehta', location: 'Hyderabad, IN', avatar: 'DR' },
    { id: 3, name: 'Grace Kim', employeeId: 'DF-4711', department: 'Finance', designation: 'Senior Accountant', email: 'grace.kim@dayflow.com', status: 'Active', joined: '2023-11-12', phone: '+91 98234 55678', manager: 'Nina Shah', location: 'Mumbai, IN', avatar: 'GK' },
    { id: 4, name: 'Noah Williams', employeeId: 'DF-7716', department: 'Support', designation: 'Customer Success Manager', email: 'noah.williams@dayflow.com', status: 'Active', joined: '2024-02-21', phone: '+91 98110 88990', manager: 'Meera Nair', location: 'Pune, IN', avatar: 'NW' },
    { id: 5, name: 'Sofia Mensah', employeeId: 'DF-1269', department: 'People Ops', designation: 'HR Generalist', email: 'sofia.mensah@dayflow.com', status: 'Inactive', joined: '2020-09-06', phone: '+91 99882 10101', manager: 'Amelia Moore', location: 'Chennai, IN', avatar: 'SM' },
    { id: 6, name: 'Rita Patel', employeeId: 'DF-5012', department: 'Finance', designation: 'Finance Analyst', email: 'rita.patel@dayflow.com', status: 'Active', joined: '2024-04-18', phone: '+91 97654 33441', manager: 'Nina Shah', location: 'Delhi, IN', avatar: 'RP' }
  ],
  employeeFilters: {
    search: '',
    department: 'All',
    status: 'All',
    designation: 'All',
    joined: 'All'
  },
  timeOff: {
    role: 'admin',
    filters: {
      search: '',
      leaveType: 'All',
      status: 'All',
      department: 'All',
      dateRange: 'All'
    },
    requests: [
      { id: 1, employee: { name: 'Amara Mensah', id: 'DF-2040', department: 'Operations', avatar: 'AM' }, leaveType: 'Paid Leave', start: '2026-08-14', end: '2026-08-16', requestDate: '2026-08-10', status: 'Pending', remarks: 'Family trip planned for the long weekend.', hrComment: '' },
      { id: 2, employee: { name: 'Daniel Reed', id: 'DF-8812', department: 'Engineering', avatar: 'DR' }, leaveType: 'Sick Leave', start: '2026-08-09', end: '2026-08-10', requestDate: '2026-08-08', status: 'Approved', remarks: 'Medical rest recommended by physician.', hrComment: 'Approved for the requested dates.' },
      { id: 3, employee: { name: 'Grace Kim', id: 'DF-4711', department: 'Finance', avatar: 'GK' }, leaveType: 'Unpaid Leave', start: '2026-08-22', end: '2026-08-25', requestDate: '2026-08-11', status: 'Pending', remarks: 'Personal travel and family commitment.', hrComment: '' },
      { id: 4, employee: { name: 'Sofia Mensah', id: 'DF-1269', department: 'People Ops', avatar: 'SM' }, leaveType: 'Paid Leave', start: '2026-08-18', end: '2026-08-19', requestDate: '2026-08-07', status: 'Rejected', remarks: 'Requested time off for a wedding event.', hrComment: 'Please provide additional documentation.' },
      { id: 5, employee: { name: 'Noah Williams', id: 'DF-7716', department: 'Support', avatar: 'NW' }, leaveType: 'Sick Leave', start: '2026-08-26', end: '2026-08-27', requestDate: '2026-08-18', status: 'Pending', remarks: 'Doctor consultation and short recovery period.', hrComment: '' },
      { id: 6, employee: { name: 'Amelia Moore', id: 'EMP001', department: 'Human Resources', avatar: 'AM' }, leaveType: 'Paid Leave', start: '2026-08-28', end: '2026-08-29', requestDate: '2026-08-19', status: 'Approved', remarks: 'Wellness break and rest after a busy quarter.', hrComment: 'Approved for the requested dates.' }
    ]
  }
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
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const demoRows = [
    { name: 'Amelia Moore', email: 'amelia.moore@dayflow.com', date: todayKey, checkin: '08:52', checkout: '17:34', status: 'Present' },
    { name: 'Rita Patel', email: 'rita.patel@dayflow.com', date: todayKey, checkin: '09:10', checkout: '18:02', status: 'Present' },
    { name: 'Daniel Reed', email: 'daniel.reed@dayflow.com', date: todayKey, checkin: '--', checkout: '--', status: 'Absent' },
    { name: 'Grace Kim', email: 'grace.kim@dayflow.com', date: todayKey, checkin: '09:04', checkout: '13:10', status: 'Half-day' },
    { name: 'Noah Williams', email: 'noah.williams@dayflow.com', date: todayKey, checkin: '08:41', checkout: null, status: 'Present' },
    { name: 'Sofia Mensah', email: 'sofia.mensah@dayflow.com', date: todayKey, checkin: '--', checkout: '--', status: 'Leave' }
  ];
  const rows = demoRows;
  const formatDate = (value) => value === todayKey ? `Today, ${today.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (value) => value && value !== '--' ? new Date(`${todayKey}T${value}`).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '--';
  const duration = (row) => {
    if (!row.checkin || row.checkin === '--') return 0;
    const start = new Date(`${row.date}T${row.checkin}`);
    const end = row.checkout && row.checkout !== '--' ? new Date(`${row.date}T${row.checkout}`) : new Date();
    return Math.max(0, (end - start) / 3600000);
  };
  const initials = (name) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const statusClass = (value) => value.toLowerCase().replace('-', '');
  const render = (filteredRows, page = 1, view = 'daily') => {
    const pageSize = 5;
    const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
    const safePage = Math.min(page, pageCount);
    const visibleRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);
    pageContent.innerHTML = `
      <section class="attendance-page">
        <div class="attendance-heading"><div><p class="eyebrow">People operations</p><h2>Attendance</h2><p>Review attendance, hours, and overtime across your team.</p></div><button type="button" class="primary-button" id="export-attendance">↓ &nbsp; Export report</button></div>
        <section class="card attendance-card">
          <div class="attendance-toolbar"><div class="attendance-search"><span>⌕</span><input id="attendance-search" type="search" placeholder="Search employee name or email" aria-label="Search attendance"></div><input id="attendance-date" type="date" value="${todayKey}" aria-label="Filter by date"><select id="attendance-status" aria-label="Filter by status"><option value="All">All statuses</option><option>Present</option><option>Absent</option><option>Half-day</option><option>Leave</option></select><div class="segmented attendance-view"><button type="button" class="${view === 'daily' ? 'active' : ''}" data-view="daily">Daily</button><button type="button" class="${view === 'weekly' ? 'active' : ''}" data-view="weekly">Weekly</button></div></div>
          <div class="attendance-summary"><span><b>${filteredRows.length}</b> records</span><span><i class="summary-dot present"></i>${filteredRows.filter((row) => row.status === 'Present').length} present</span><span><i class="summary-dot absent"></i>${filteredRows.filter((row) => row.status === 'Absent').length} absent</span><span><i class="summary-dot leave"></i>${filteredRows.filter((row) => row.status === 'Leave').length} on leave</span></div>
          <div class="table-wrap"><table class="attendance-table"><thead><tr><th>Date</th><th>Employee</th><th>Check-in</th><th>Check-out</th><th>Working time</th><th>Extra time</th><th>Status</th></tr></thead><tbody>${visibleRows.map((row) => { const hours = duration(row); const extra = Math.max(0, hours - 8); return `<tr><td><strong>${formatDate(row.date)}</strong></td><td><div class="attendance-employee"><span class="attendance-avatar">${initials(row.name)}</span><span><strong>${escape(row.name)}</strong><small>${escape(row.email)}</small></span></div></td><td class="time-cell">${formatTime(row.checkin)}</td><td class="time-cell ${!row.checkout || row.checkout === '--' ? 'active-time' : ''}">${row.checkout ? formatTime(row.checkout) : 'Active'}</td><td><strong>${hours ? `${hours.toFixed(1)}h` : '--'}</strong></td><td>${extra ? `<strong class="overtime">+${extra.toFixed(1)}h</strong>` : '<span class="muted-cell">--</span>'}</td><td><span class="pill ${statusClass(row.status)}">${escape(row.status)}</span></td></tr>`; }).join('') || '<tr><td class="empty" colspan="7">No attendance records match these filters.</td></tr>'}</tbody></table></div>
          <div class="attendance-footer"><span>Showing ${visibleRows.length ? (safePage - 1) * pageSize + 1 : 0}–${Math.min(safePage * pageSize, filteredRows.length)} of ${filteredRows.length}</span><div class="pagination"><button type="button" id="previous-page" ${safePage === 1 ? 'disabled' : ''}>←</button><span>Page ${safePage} of ${pageCount}</span><button type="button" id="next-page" ${safePage === pageCount ? 'disabled' : ''}>→</button></div></div>
        </section>
      </section>`;
    const search = document.getElementById('attendance-search');
    const date = document.getElementById('attendance-date');
    const status = document.getElementById('attendance-status');
    const applyFilters = () => {
      const query = search.value.toLowerCase();
      const selectedDate = date.value;
      const selectedStatus = status.value;
      const filtered = rows.filter((row) => (view === 'weekly' || !selectedDate || row.date === selectedDate) && (selectedStatus === 'All' || row.status === selectedStatus) && `${row.name} ${row.email}`.toLowerCase().includes(query));
      render(filtered, 1, view);
    };
    search.addEventListener('input', applyFilters); date.addEventListener('change', applyFilters); status.addEventListener('change', applyFilters);
    document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => render(rows, 1, button.dataset.view)));
    document.getElementById('previous-page').addEventListener('click', () => render(filteredRows, safePage - 1, view));
    document.getElementById('next-page').addEventListener('click', () => render(filteredRows, safePage + 1, view));
    document.getElementById('export-attendance').addEventListener('click', () => showToast('Attendance report export started.'));
  };
  render(rows);
}

function formatLeaveDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function getRequestDuration(start, end) {
  const diff = new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`);
  const days = Math.max(1, Math.round(diff / 86400000) + 1);
  return `${days} day${days > 1 ? 's' : ''}`;
}

function getLeaveBadge(status) {
  if (status === 'Pending') return 'status-badge warning';
  if (status === 'Approved') return 'status-badge success';
  return 'status-badge danger';
}

function renderTimeOffView() {
  const role = state.timeOff.role;
  const filteredRequests = state.timeOff.requests.filter((request) => {
    const fullText = `${request.employee.name} ${request.employee.id} ${request.leaveType} ${request.status}`.toLowerCase();
    const matchesSearch = !state.timeOff.filters.search || fullText.includes(state.timeOff.filters.search.toLowerCase());
    const matchesType = state.timeOff.filters.leaveType === 'All' || request.leaveType === state.timeOff.filters.leaveType;
    const matchesStatus = state.timeOff.filters.status === 'All' || request.status === state.timeOff.filters.status;
    const matchesDepartment = state.timeOff.filters.department === 'All' || request.employee.department === state.timeOff.filters.department;
    const matchesDateRange = state.timeOff.filters.dateRange === 'All' || state.timeOff.filters.dateRange === 'This month';
    return matchesSearch && matchesType && matchesStatus && matchesDepartment && matchesDateRange;
  });

  const employeeRequests = state.timeOff.requests.filter((request) => request.employee.id === 'EMP001');
  const listSource = role === 'employee' ? employeeRequests : filteredRequests;
  const summary = {
    pending: state.timeOff.requests.filter((request) => request.status === 'Pending').length,
    approved: state.timeOff.requests.filter((request) => request.status === 'Approved').length,
    rejected: state.timeOff.requests.filter((request) => request.status === 'Rejected').length,
    onLeave: 14
  };

  const departmentOptions = ['All', ...new Set(state.timeOff.requests.map((request) => request.employee.department))];

  const tableRows = listSource.length ? listSource.map((request) => `
    <tr>
      <td>
        <div class="employee-cell">
          <span class="mini-avatar">${request.employee.avatar}</span>
          <div>
            <strong>${request.employee.name}</strong>
            <small>${request.employee.id}</small>
          </div>
        </div>
      </td>
      <td><span class="leave-type-pill">${request.leaveType}</span></td>
      <td>
        <div class="date-range-cell">
          <strong>${formatLeaveDate(request.start)} – ${formatLeaveDate(request.end)}</strong>
          <small>${getRequestDuration(request.start, request.end)}</small>
        </div>
      </td>
      <td>${getRequestDuration(request.start, request.end)}</td>
      <td>${formatLeaveDate(request.requestDate)}</td>
      <td><span class="${getLeaveBadge(request.status)}"><span class="status-dot"></span>${request.status}</span></td>
      <td>
        <div class="row-actions">
          ${request.status === 'Pending' ? '<button type="button" class="action-button approve" data-timeoff-action="approve" data-timeoff-id="' + request.id + '">Approve</button><button type="button" class="action-button reject" data-timeoff-action="reject" data-timeoff-id="' + request.id + '">Reject</button>' : '<button type="button" class="action-button secondary" data-timeoff-action="details" data-timeoff-id="' + request.id + '">View Details</button>'}
        </div>
      </td>
    </tr>
  `).join('') : `
    <tr>
      <td colspan="7">
        <div class="empty-timeoff-state">
          <h4>${role === 'employee' ? "You haven't submitted any time off requests yet." : 'No time off requests'}</h4>
          <p>${role === 'employee' ? 'Start your leave request with a quick form.' : 'There are no leave requests matching your current filters.'}</p>
          <button type="button" class="secondary-button" data-timeoff-action="apply">${role === 'employee' ? 'Apply for Leave' : 'Clear Filters'}</button>
        </div>
      </td>
    </tr>
  `;

  pageContent.innerHTML = `
    <section class="timeoff-shell">
      <header class="page-header timeoff-header-row">
        <div>
          <p class="eyebrow">WORKFORCE</p>
          <h1>Time Off</h1>
          <p id="page-description">Manage leave requests, time-off records and approvals.</p>
        </div>
        <div class="header-actions">
          <div class="segmented role-switcher" aria-label="Time off role switcher">
            <button type="button" class="${role === 'admin' ? 'active' : ''}" data-timeoff-role="admin">Admin</button>
            <button type="button" class="${role === 'employee' ? 'active' : ''}" data-timeoff-role="employee">Employee</button>
          </div>
          ${role === 'admin' ? '<button type="button" class="primary-button" data-timeoff-action="add">+ Add Time Off</button>' : '<button type="button" class="primary-button" data-timeoff-action="apply">Apply for Leave</button>'}
        </div>
      </header>

      <div class="stats-grid timeoff-stats">
        <article class="metric-card card">
          <span>Pending Requests</span>
          <strong>${summary.pending}</strong>
          <small>Needs attention</small>
        </article>
        <article class="metric-card card">
          <span>Approved</span>
          <strong>42</strong>
          <small>This month</small>
        </article>
        <article class="metric-card card">
          <span>Rejected</span>
          <strong>6</strong>
          <small>This month</small>
        </article>
        <article class="metric-card card">
          <span>On Leave Today</span>
          <strong>${summary.onLeave}</strong>
          <small>Employees</small>
        </article>
      </div>

      <section class="card table-card timeoff-card">
        <div class="card-header timeoff-section-header">
          <div>
            <h3>Time Off Requests</h3>
            <p>Review and manage employee leave requests.</p>
          </div>
          <div class="pending-flag">
            <span class="status-dot pending"></span>
            ${summary.pending} Pending Requests
          </div>
        </div>

        <div class="timeoff-toolbar">
          <label class="search-field">
            <span class="sr-only">Search</span>
            <input id="timeoff-search" type="search" autocomplete="off" value="${state.timeOff.filters.search}" placeholder="Search employees or leave requests..." />
          </label>

          <select id="timeoff-leave-type">
            <option value="All">Leave Type</option>
            <option value="Paid Leave" ${state.timeOff.filters.leaveType === 'Paid Leave' ? 'selected' : ''}>Paid Leave</option>
            <option value="Sick Leave" ${state.timeOff.filters.leaveType === 'Sick Leave' ? 'selected' : ''}>Sick Leave</option>
            <option value="Unpaid Leave" ${state.timeOff.filters.leaveType === 'Unpaid Leave' ? 'selected' : ''}>Unpaid Leave</option>
          </select>

          <select id="timeoff-status">
            <option value="All">Status</option>
            <option value="Pending" ${state.timeOff.filters.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Approved" ${state.timeOff.filters.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Rejected" ${state.timeOff.filters.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          </select>

          <select id="timeoff-department">
            <option value="All">Department</option>
            ${departmentOptions.map((value) => `<option value="${value}" ${state.timeOff.filters.department === value ? 'selected' : ''}>${value}</option>`).join('')}
          </select>

          <select id="timeoff-date-range">
            <option value="All">Date Range</option>
            <option value="This month" ${state.timeOff.filters.dateRange === 'This month' ? 'selected' : ''}>This month</option>
          </select>

          ${state.timeOff.filters.search || state.timeOff.filters.leaveType !== 'All' || state.timeOff.filters.status !== 'All' || state.timeOff.filters.department !== 'All' || state.timeOff.filters.dateRange !== 'All' ? '<button type="button" class="link-button compact-link" id="timeoff-clear-filters">Clear Filters</button>' : ''}
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Date Range</th>
                <th>Duration</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      </section>
    </section>

    <div id="modal-backdrop" class="modal-backdrop hidden"></div>

    <aside id="leave-details-drawer" class="modal drawer hidden" aria-label="Leave request details">
      <div class="drawer-header">
        <div>
          <p class="eyebrow small">Request Details</p>
          <h3>Leave Request</h3>
        </div>
        <button type="button" class="close-button" data-close="leave-details-drawer" aria-label="Close request details">×</button>
      </div>
      <div id="leave-details-content"></div>
    </aside>

    <aside id="leave-request-modal" class="modal small hidden" aria-label="Apply for leave">
      <div class="modal-header">
        <div>
          <p class="eyebrow small">${role === 'employee' ? 'My Time Off' : 'Add Time Off'}</p>
          <h3>${role === 'employee' ? 'Apply for Leave' : 'Create Time Off Record'}</h3>
        </div>
        <button type="button" class="close-button" data-close="leave-request-modal" aria-label="Close dialog">×</button>
      </div>
      <form id="leave-request-form" class="modal-form compact-form">
        <div class="field-group">
          <label>
            Leave Type
            <select name="leaveType" required>
              <option value="">Select leave type</option>
              <option>Paid Leave</option>
              <option>Sick Leave</option>
              <option>Unpaid Leave</option>
            </select>
          </label>
          <div class="two-up">
            <label>
              Start Date
              <input type="date" name="startDate" required />
            </label>
            <label>
              End Date
              <input type="date" name="endDate" required />
            </label>
          </div>
          <label>
            Remarks
            <textarea name="remarks" rows="4" required placeholder="Add relevant information for the leave request."></textarea>
          </label>
        </div>
        <div class="modal-actions">
          <button type="button" class="secondary-button" data-close="leave-request-modal">Cancel</button>
          <button type="submit" class="primary-button">Submit Request</button>
        </div>
      </form>
    </aside>
  `;

  const detailsContainer = document.getElementById('leave-details-content');
  if (detailsContainer) {
    const selectedRequest = state.timeOff.requests[0];
    if (selectedRequest) {
      detailsContainer.innerHTML = renderLeaveDetails(selectedRequest);
    }
  }

  attachTimeOffListeners();
}

function renderLeaveDetails(request) {
  const role = state.timeOff.role;
  const data = request || state.timeOff.requests[0];
  const detailStatus = data.status === 'Pending' ? 'Pending' : data.status;
  return `
    <div class="drawer-body">
      <div class="details-employee">
        <div class="details-avatar">${data.employee.avatar}</div>
        <div>
          <h4>${data.employee.name}</h4>
          <p>${data.employee.id}</p>
          <span>${data.employee.department}</span>
        </div>
      </div>

      <div class="details-grid">
        <div class="detail-block">
          <span>Leave Type</span>
          <strong>${data.leaveType}</strong>
        </div>
        <div class="detail-block">
          <span>Start Date</span>
          <strong>${formatLeaveDate(data.start)}</strong>
        </div>
        <div class="detail-block">
          <span>End Date</span>
          <strong>${formatLeaveDate(data.end)}</strong>
        </div>
        <div class="detail-block">
          <span>Duration</span>
          <strong>${getRequestDuration(data.start, data.end)}</strong>
        </div>
        <div class="detail-block">
          <span>Request Date</span>
          <strong>${formatLeaveDate(data.requestDate)}</strong>
        </div>
        <div class="detail-block">
          <span>Status</span>
          <strong>${detailStatus}</strong>
        </div>
      </div>

      <div class="detail-panel">
        <h5>Remarks</h5>
        <p>${data.remarks}</p>
      </div>

      <div class="detail-panel">
        <h5>HR Comment</h5>
        <p>${data.hrComment || 'No comment added yet.'}</p>
      </div>

      <form id="leave-decision-form" data-timeoff-id="${data.id}" class="decision-form">
        <label class="comment-field">
          Comment
          <textarea name="comment" rows="3" placeholder="Approved for the requested dates."></textarea>
        </label>
        <div class="decision-actions">
          <button type="button" class="secondary-button" data-close="leave-details-drawer">Close</button>
          ${role === 'admin' ? '<button type="submit" class="primary-button" data-timeoff-action="approve-submit">Approve</button><button type="button" class="secondary-button danger-button" data-timeoff-action="reject-submit" data-timeoff-id="' + data.id + '">Reject</button>' : '<button type="button" class="primary-button" data-timeoff-action="close-detail">Done</button>'}
        </div>
      </form>
    </div>
  `;
}

function attachTimeOffListeners() {
  const roleButtons = document.querySelectorAll('[data-timeoff-role]');
  roleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.timeOff.role = button.dataset.timeoffRole;
      renderTimeOffView();
    });
  });

  const filterFields = {
    search: document.getElementById('timeoff-search'),
    leaveType: document.getElementById('timeoff-leave-type'),
    status: document.getElementById('timeoff-status'),
    department: document.getElementById('timeoff-department'),
    dateRange: document.getElementById('timeoff-date-range')
  };

  if (filterFields.search) {
    filterFields.search.addEventListener('input', (event) => {
      state.timeOff.filters.search = event.target.value;
      renderTimeOffView();
    });
  }

  ['leaveType', 'status', 'department', 'dateRange'].forEach((field) => {
    if (filterFields[field]) {
      filterFields[field].addEventListener('change', (event) => {
        state.timeOff.filters[field] = event.target.value;
        renderTimeOffView();
      });
    }
  });

  document.getElementById('timeoff-clear-filters')?.addEventListener('click', () => {
    state.timeOff.filters = { search: '', leaveType: 'All', status: 'All', department: 'All', dateRange: 'All' };
    renderTimeOffView();
  });

  document.querySelectorAll('[data-timeoff-action]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const { timeoffAction, timeoffId } = event.currentTarget.dataset;

      if (timeoffAction === 'add' || timeoffAction === 'apply') {
        openModal(document.getElementById('leave-request-modal'));
        return;
      }

      if (timeoffAction === 'details') {
        const request = state.timeOff.requests.find((item) => item.id === Number(timeoffId));
        if (request) {
          const drawer = document.getElementById('leave-details-drawer');
          const detailsContent = document.getElementById('leave-details-content');
          detailsContent.innerHTML = renderLeaveDetails(request);
          openModal(drawer);

          const decisionForm = document.getElementById('leave-decision-form');
          decisionForm?.addEventListener('submit', (submitEvent) => {
            submitEvent.preventDefault();
            const formData = new FormData(submitEvent.currentTarget);
            const targetRequest = state.timeOff.requests.find((item) => item.id === Number(submitEvent.currentTarget.dataset.timeoffId));
            if (targetRequest) {
              targetRequest.status = 'Approved';
              targetRequest.hrComment = formData.get('comment')?.toString().trim() || 'Approved for the requested dates.';
              renderTimeOffView();
              showToast('Leave request approved successfully.');
            }
          });

          document.querySelector('[data-timeoff-action="reject-submit"]')?.addEventListener('click', () => {
            const targetRequest = state.timeOff.requests.find((item) => item.id === Number(timeoffId));
            if (targetRequest) {
              targetRequest.status = 'Rejected';
              targetRequest.hrComment = document.querySelector('#leave-decision-form textarea')?.value?.trim() || 'Please provide additional documentation.';
              renderTimeOffView();
              showToast('Leave request rejected successfully.');
            }
          });
        }
        return;
      }

      if (timeoffAction === 'approve' || timeoffAction === 'reject') {
        const request = state.timeOff.requests.find((item) => item.id === Number(timeoffId));
        if (!request) return;

        request.status = timeoffAction === 'approve' ? 'Approved' : 'Rejected';
        request.hrComment = timeoffAction === 'approve' ? 'Approved for the requested dates.' : 'Please provide additional documentation.';
        renderTimeOffView();
        showToast(timeoffAction === 'approve' ? 'Leave request approved successfully.' : 'Leave request rejected successfully.');
      }
    });
  });

  document.getElementById('leave-request-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const leaveType = formData.get('leaveType')?.toString().trim();
    const startDate = formData.get('startDate')?.toString();
    const endDate = formData.get('endDate')?.toString();
    const remarks = formData.get('remarks')?.toString().trim();

    if (!leaveType || !startDate || !endDate || !remarks) {
      showToast('Please complete all fields before submitting.');
      return;
    }

    state.timeOff.requests.unshift({
      id: Date.now(),
      employee: { name: 'Amelia Moore', id: 'EMP001', department: 'Human Resources', avatar: 'AM' },
      leaveType,
      start: startDate,
      end: endDate,
      requestDate: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      remarks,
      hrComment: ''
    });

    form.reset();
    closeModal(document.getElementById('leave-request-modal'));
    renderTimeOffView();
    showToast('Leave request submitted successfully.');
  });
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

function formatJoinedDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getEmployeeStatusClass(status) {
  if (status === 'Active') return 'status-pill success';
  if (status === 'On Leave') return 'status-pill warning';
  return 'status-pill neutral';
}

function renderEmployeeDetailsDrawer(employee) {
  return `
    <div class="drawer-body employee-drawer-body">
      <div class="details-employee employee-details-header">
        <div class="details-avatar">${employee.avatar}</div>
        <div>
          <h4>${employee.name}</h4>
          <p>${employee.designation}</p>
          <span>${employee.employeeId}</span>
        </div>
      </div>

      <div class="quick-actions-row">
        <button type="button" class="secondary-button" data-employee-action="view-profile" data-employee-id="${employee.id}">View Profile</button>
        <button type="button" class="secondary-button" data-employee-action="attendance" data-employee-id="${employee.id}">Attendance</button>
        <button type="button" class="secondary-button" data-employee-action="time-off" data-employee-id="${employee.id}">Time Off</button>
      </div>

      <div class="details-grid employee-details-grid">
        <div class="detail-block">
          <span>Email</span>
          <strong>${employee.email}</strong>
        </div>
        <div class="detail-block">
          <span>Phone</span>
          <strong>${employee.phone}</strong>
        </div>
        <div class="detail-block">
          <span>Department</span>
          <strong>${employee.department}</strong>
        </div>
        <div class="detail-block">
          <span>Manager</span>
          <strong>${employee.manager}</strong>
        </div>
        <div class="detail-block">
          <span>Location</span>
          <strong>${employee.location}</strong>
        </div>
        <div class="detail-block">
          <span>Joining Date</span>
          <strong>${formatJoinedDate(employee.joined)}</strong>
        </div>
      </div>

      <div class="detail-panel employee-stat-panel">
        <h5>Quick Stats</h5>
        <div class="employee-mini-stats">
          <div><span>Attendance</span><strong>96%</strong></div>
          <div><span>Leave Balance</span><strong>14 days</strong></div>
          <div><span>Payroll</span><strong>Updated</strong></div>
        </div>
      </div>
    </div>
  `;
}

function renderEmployeesView() {
  const filteredEmployees = state.employees.filter((employee) => {
    const searchText = `${employee.name} ${employee.employeeId} ${employee.email}`.toLowerCase();
    const matchesSearch = !state.employeeFilters.search || searchText.includes(state.employeeFilters.search.toLowerCase());
    const matchesDepartment = state.employeeFilters.department === 'All' || employee.department === state.employeeFilters.department;
    const matchesStatus = state.employeeFilters.status === 'All' || employee.status === state.employeeFilters.status;
    const matchesDesignation = state.employeeFilters.designation === 'All' || employee.designation === state.employeeFilters.designation;
    const matchesJoined = state.employeeFilters.joined === 'All' || state.employeeFilters.joined === 'Recently joined';
    return matchesSearch && matchesDepartment && matchesStatus && matchesDesignation && matchesJoined;
  });

  const departmentOptions = ['All', ...new Set(state.employees.map((employee) => employee.department))];
  const designationOptions = ['All', ...new Set(state.employees.map((employee) => employee.designation))];
  const summary = {
    total: state.employees.length,
    active: state.employees.filter((employee) => employee.status === 'Active').length,
    onLeave: state.employees.filter((employee) => employee.status === 'On Leave').length,
    newThisMonth: 8
  };

  const rows = filteredEmployees.length ? filteredEmployees.map((employee) => `
    <tr data-employee-row="${employee.id}">
      <td>
        <div class="employee-cell">
          <span class="mini-avatar employee-avatar">${employee.avatar}</span>
          <div>
            <strong>${employee.name}</strong>
            <small>${employee.designation}</small>
          </div>
        </div>
      </td>
      <td>${employee.employeeId}</td>
      <td>${employee.department}</td>
      <td>${employee.designation}</td>
      <td><a href="mailto:${employee.email}">${employee.email}</a></td>
      <td><span class="${getEmployeeStatusClass(employee.status)}"><span class="status-dot"></span>${employee.status}</span></td>
      <td>${formatJoinedDate(employee.joined)}</td>
      <td>
        <div class="employee-menu-wrap">
          <button type="button" class="menu-trigger" data-employee-menu="${employee.id}" aria-label="Open employee actions">⋯</button>
          <div class="employee-menu hidden" data-employee-menu-panel="${employee.id}">
            <button type="button" data-employee-action="view-profile" data-employee-id="${employee.id}">View Profile</button>
            <button type="button" data-employee-action="edit" data-employee-id="${employee.id}">Edit Employee</button>
            <button type="button" data-employee-action="attendance" data-employee-id="${employee.id}">Attendance</button>
            <button type="button" data-employee-action="time-off" data-employee-id="${employee.id}">Time Off</button>
            <button type="button" data-employee-action="payroll" data-employee-id="${employee.id}">Payroll</button>
            <button type="button" data-employee-action="documents" data-employee-id="${employee.id}">Documents</button>
            <button type="button" data-employee-action="deactivate" data-employee-id="${employee.id}">Deactivate</button>
          </div>
        </div>
      </td>
    </tr>
  `).join('') : `
    <tr>
      <td colspan="8">
        <div class="empty-timeoff-state employee-empty-state">
          <h4>No employees found</h4>
          <p>Try adjusting your search or filters.</p>
          <button type="button" class="secondary-button" id="employees-clear-filters">Clear Filters</button>
        </div>
      </td>
    </tr>
  `;

  pageContent.innerHTML = `
    <section class="employees-shell">
      <header class="page-header timeoff-header-row">
        <div>
          <p class="eyebrow">WORKFORCE</p>
          <h1>Employees</h1>
          <p id="page-description">Manage your organization's employees and their information.</p>
        </div>
        <div class="header-actions">
          <button type="button" class="secondary-button" id="employee-export-btn">Export</button>
          <button type="button" class="primary-button" id="add-employee-btn">+ Add Employee</button>
        </div>
      </header>

      <div class="stats-grid timeoff-stats">
        <article class="metric-card card">
          <span>Total Employees</span>
          <strong>${summary.total}</strong>
          <small>Organization-wide</small>
        </article>
        <article class="metric-card card">
          <span>Active</span>
          <strong>${summary.active}</strong>
          <small>Currently active</small>
        </article>
        <article class="metric-card card">
          <span>On Leave</span>
          <strong>${summary.onLeave}</strong>
          <small>This period</small>
        </article>
        <article class="metric-card card">
          <span>New This Month</span>
          <strong>${summary.newThisMonth}</strong>
          <small>Fresh joins</small>
        </article>
      </div>

      <section class="card table-card employee-card">
        <div class="timeoff-toolbar employee-toolbar">
          <label class="search-field employee-search">
            <span class="search-icon">⌕</span>
            <input id="employee-search" type="search" value="${state.employeeFilters.search}" placeholder="Search employees by name, ID or email..." aria-label="Search employees" />
          </label>

          <select id="employee-department">
            ${departmentOptions.map((value) => `<option value="${value}" ${state.employeeFilters.department === value ? 'selected' : ''}>${value === 'All' ? 'Department' : value}</option>`).join('')}
          </select>

          <select id="employee-status">
            <option value="All" ${state.employeeFilters.status === 'All' ? 'selected' : ''}>Status</option>
            <option value="Active" ${state.employeeFilters.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="On Leave" ${state.employeeFilters.status === 'On Leave' ? 'selected' : ''}>On Leave</option>
            <option value="Inactive" ${state.employeeFilters.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
          </select>

          <select id="employee-designation">
            ${designationOptions.map((value) => `<option value="${value}" ${state.employeeFilters.designation === value ? 'selected' : ''}>${value === 'All' ? 'Designation' : value}</option>`).join('')}
          </select>

          <select id="employee-joined">
            <option value="All" ${state.employeeFilters.joined === 'All' ? 'selected' : ''}>Joining Date</option>
            <option value="Recently joined" ${state.employeeFilters.joined === 'Recently joined' ? 'selected' : ''}>Recently joined</option>
          </select>

          ${(state.employeeFilters.search || state.employeeFilters.department !== 'All' || state.employeeFilters.status !== 'All' || state.employeeFilters.designation !== 'All' || state.employeeFilters.joined !== 'All') ? '<button type="button" class="link-button compact-link" id="employee-clear-filters">Clear Filters</button>' : ''}
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>

        <div class="employee-footer">
          <span>Showing 1–${Math.min(filteredEmployees.length, 20)} of ${filteredEmployees.length} employees</span>
          <div class="pagination">
            <button type="button" class="page-button" disabled>Previous</button>
            <span class="page-pill active">1</span>
            <span class="page-pill">2</span>
            <span class="page-pill">3</span>
            <button type="button" class="page-button">Next</button>
          </div>
        </div>
      </section>
    </section>

    <div id="modal-backdrop" class="modal-backdrop hidden"></div>

    <aside id="employee-details-drawer" class="modal drawer hidden" aria-label="Employee details drawer">
      <div class="drawer-header">
        <div>
          <p class="eyebrow small">Employee Details</p>
          <h3>Employee Profile</h3>
        </div>
        <button type="button" class="close-button" data-close="employee-details-drawer" aria-label="Close drawer">×</button>
      </div>
      <div id="employee-details-content"></div>
    </aside>

    <aside id="employee-form-modal" class="modal hidden" aria-label="Employee form modal">
      <div class="modal-header">
        <div>
          <p class="eyebrow small">Workforce</p>
          <h3 id="employee-form-title">Add Employee</h3>
        </div>
        <button type="button" class="close-button" data-close="employee-form-modal" aria-label="Close form">×</button>
      </div>
      <form id="employee-form" class="modal-form">
        <div class="field-group">
          <div class="two-up">
            <label>
              Full Name
              <input type="text" name="fullName" placeholder="Amara Mensah" required />
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="employee@dayflow.com" required />
            </label>
          </div>
          <div class="two-up">
            <label>
              Phone
              <input type="tel" name="phone" placeholder="+91 98xxxxxx" />
            </label>
            <label>
              Profile Picture
              <input type="text" name="avatar" placeholder="AM" />
            </label>
          </div>
          <div class="two-up">
            <label>
              Employee ID
              <input type="text" name="employeeId" placeholder="DF-2040" required />
            </label>
            <label>
              Department
              <select name="department" required>
                <option value="">Select department</option>
                <option>Design & Experience</option>
                <option>Engineering</option>
                <option>Finance</option>
                <option>Support</option>
                <option>People Ops</option>
              </select>
            </label>
          </div>
          <div class="two-up">
            <label>
              Designation
              <input type="text" name="designation" placeholder="Product Designer" required />
            </label>
            <label>
              Manager
              <input type="text" name="manager" placeholder="Riya Kapoor" />
            </label>
          </div>
          <div class="two-up">
            <label>
              Location
              <input type="text" name="location" placeholder="Bengaluru, IN" />
            </label>
            <label>
              Joining Date
              <input type="date" name="joined" required />
            </label>
          </div>
          <div class="two-up">
            <label>
              Role
              <select name="role">
                <option>Employee</option>
                <option>Manager</option>
                <option>HR</option>
                <option>Admin</option>
              </select>
            </label>
            <label>
              Account Status
              <select name="status">
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="secondary-button" data-close="employee-form-modal">Cancel</button>
          <button type="submit" class="primary-button" id="employee-submit-btn">Create Employee</button>
        </div>
      </form>
    </aside>
  `;

  bindEmployeeInteractions();
}

function bindEmployeeInteractions() {
  document.getElementById('add-employee-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('employee-form-modal');
    const title = document.getElementById('employee-form-title');
    const submitButton = document.getElementById('employee-submit-btn');
    if (title) title.textContent = 'Add Employee';
    if (submitButton) submitButton.textContent = 'Create Employee';
    const form = document.getElementById('employee-form');
    form?.reset();
    form?.setAttribute('data-mode', 'create');
    openModal(modal);
  });

  document.getElementById('employee-export-btn')?.addEventListener('click', () => showToast('Employee export started.'));
  document.getElementById('employees-clear-filters')?.addEventListener('click', () => {
    state.employeeFilters = { search: '', department: 'All', status: 'All', designation: 'All', joined: 'All' };
    renderEmployeesView();
  });

  document.getElementById('employee-clear-filters')?.addEventListener('click', () => {
    state.employeeFilters = { search: '', department: 'All', status: 'All', designation: 'All', joined: 'All' };
    renderEmployeesView();
  });

  document.getElementById('employee-search')?.addEventListener('input', (event) => {
    state.employeeFilters.search = event.target.value;
    renderEmployeesView();
  });

  ['employee-department', 'employee-status', 'employee-designation', 'employee-joined'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', (event) => {
      const keyMap = {
        'employee-department': 'department',
        'employee-status': 'status',
        'employee-designation': 'designation',
        'employee-joined': 'joined'
      };
      const key = keyMap[id];
      state.employeeFilters[key] = event.target.value;
      renderEmployeesView();
    });
  });

  document.querySelectorAll('[data-employee-menu]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      const employeeId = Number(event.currentTarget.dataset.employeeMenu);
      const panel = document.querySelector(`[data-employee-menu-panel="${employeeId}"]`);
      document.querySelectorAll('.employee-menu').forEach((menu) => {
        if (menu !== panel) menu.classList.add('hidden');
      });
      panel?.classList.toggle('hidden');
    });
  });

  document.addEventListener('click', (event) => {
    const menuButton = event.target.closest('[data-employee-menu]');
    const menuItem = event.target.closest('[data-employee-action]');
    const rowTrigger = event.target.closest('[data-employee-row]');

    if (!menuButton && !menuItem && !rowTrigger) {
      document.querySelectorAll('.employee-menu').forEach((menu) => menu.classList.add('hidden'));
    }

    if (menuItem) {
      const employeeId = Number(menuItem.dataset.employeeId);
      const employee = state.employees.find((item) => item.id === employeeId);
      const action = menuItem.dataset.employeeAction;

      if (action === 'view-profile' || action === 'view') {
        openDrawerEmployee(employee);
      }

      if (action === 'edit') {
        const form = document.getElementById('employee-form');
        const title = document.getElementById('employee-form-title');
        const submitButton = document.getElementById('employee-submit-btn');
        title.textContent = 'Edit Employee';
        submitButton.textContent = 'Save Changes';
        form.dataset.mode = 'edit';
        form.dataset.employeeId = employeeId;
        form.fullName.value = employee.name;
        form.email.value = employee.email;
        form.phone.value = employee.phone;
        form.avatar.value = employee.avatar;
        form.employeeId.value = employee.employeeId;
        form.department.value = employee.department;
        form.designation.value = employee.designation;
        form.manager.value = employee.manager;
        form.location.value = employee.location;
        form.joined.value = employee.joined;
        form.status.value = employee.status;
        openModal(document.getElementById('employee-form-modal'));
      }

      if (action === 'attendance') showToast(`${employee.name} attendance is ready to review.`);
      if (action === 'time-off') showToast(`${employee.name} time-off records opened.`);
      if (action === 'payroll') showToast(`${employee.name} payroll summary opened.`);
      if (action === 'documents') showToast(`${employee.name} documents are not available yet.`);
      if (action === 'deactivate') {
        if (employee) {
          employee.status = 'Inactive';
          renderEmployeesView();
          showToast(`${employee.name} status updated to Inactive.`);
        }
      }
    }

    if (rowTrigger) {
      const employeeId = Number(rowTrigger.dataset.employeeRow);
      const employee = state.employees.find((item) => item.id === employeeId);
      if (employee) openDrawerEmployee(employee);
    }
  });

  document.getElementById('employee-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const employeePayload = {
      name: formData.get('fullName')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      phone: formData.get('phone')?.toString().trim() || '—',
      avatar: (formData.get('avatar')?.toString().trim() || formData.get('fullName')?.toString().trim().split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()),
      employeeId: formData.get('employeeId')?.toString().trim(),
      department: formData.get('department')?.toString().trim(),
      designation: formData.get('designation')?.toString().trim(),
      manager: formData.get('manager')?.toString().trim() || 'Unassigned',
      location: formData.get('location')?.toString().trim() || 'Remote',
      joined: formData.get('joined')?.toString() || new Date().toISOString().slice(0, 10),
      status: formData.get('status')?.toString() || 'Active'
    };

    if (!employeePayload.name || !employeePayload.email || !employeePayload.employeeId || !employeePayload.department || !employeePayload.designation || !employeePayload.joined) {
      showToast('Please complete all required employee fields.');
      return;
    }

    if (form.dataset.mode === 'edit') {
      const target = state.employees.find((employee) => employee.id === Number(form.dataset.employeeId));
      if (target) {
        Object.assign(target, employeePayload);
        showToast('Employee information updated successfully.');
      }
    } else {
      state.employees.unshift({ id: Date.now(), ...employeePayload });
      showToast('Employee created successfully.');
    }

    closeModal(document.getElementById('employee-form-modal'));
    renderEmployeesView();
    form.reset();
  });
}

function openDrawerEmployee(employee) {
  if (!employee) return;
  const drawer = document.getElementById('employee-details-drawer');
  const content = document.getElementById('employee-details-content');
  content.innerHTML = renderEmployeeDetailsDrawer(employee);
  openModal(drawer);

  document.querySelectorAll('[data-employee-action]').forEach((button) => {
    if (button.dataset.employeeAction === 'view-profile') {
      button.addEventListener('click', () => {
        showToast(`${employee.name} profile opened.`);
      });
    }
  });
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
    closeModal(document.getElementById('employee-form-modal'));
    closeModal(document.getElementById('employee-details-drawer'));
    closeModal(document.getElementById('leave-details-drawer'));
    closeModal(document.getElementById('leave-request-modal'));
  }
});

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => {
    const modal = document.getElementById(button.dataset.close);
    closeModal(modal);
  });
});

renderView('profile');
