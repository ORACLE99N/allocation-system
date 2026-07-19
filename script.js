const departments = [
  'Electrical/Electronic Engineering Technology',
  'Civil Engineering Technology',
  'Mechanical Engineering Technology',
  'Computer Engineering Technology',
  'Architectural Technology',
  'Building Technology',
  'Estate Management and Valuation',
  'Quantity Surveying',
  'Urban and Regional Planning',
  'Computer Science',
  'Statistics',
  'Science Laboratory Technology',
  'Environmental Biology',
  'Mathematics and Statistics',
  'Accountancy',
  'Business Administration and Management',
  'Public Administration',
  'Marketing',
  'Office Technology and Management',
  'Fine Art',
  'Mass Communication'
];

const levels = ['ND 1', 'ND 2', 'HND 1', 'HND 2'];
const halls = [];
const generateHalls = (prefix, max) => {
  for (let i = 1; i <= max; i += 1) {
    halls.push(`${prefix} ${i}`);
  }
};

generateHalls('SBMT', 20);
generateHalls('GH', 3);
generateHalls('SBH', 12);
generateHalls('NSB', 30);
generateHalls('ABC', 4);
generateHalls('HMT', 15);

const views = ['gatewayScreen', 'adminLoginScreen', 'studentLoginScreen', 'adminDashboard', 'studentDashboard'];
let allocationsDB = JSON.parse(localStorage.getItem('onu_poly_allocations')) || [];
let currentView = 'gatewayScreen';

function popSelect(id, arr) {
  const el = document.getElementById(id);
  arr.forEach((value) => el.add(new Option(value, value)));
}

function saveUIState() {
  const state = {
    currentView,
    adminDept: document.getElementById('adminDeptSelect').value,
    adminLevel: document.getElementById('adminLevelSelect').value,
    adminDay: document.getElementById('adminDaySelect').value,
    adminHall: document.getElementById('adminHallSelect').value,
    adminTime: document.getElementById('adminTimeSelect').value,
    studentDept: document.getElementById('studentDeptSelect').value,
    studentLevel: document.getElementById('studentLevelSelect').value
  };
  localStorage.setItem('onu_poly_ui_state', JSON.stringify(state));
}

function restoreUIState() {
  const savedState = JSON.parse(localStorage.getItem('onu_poly_ui_state') || '{}');
  const selects = [
    ['adminDeptSelect', savedState.adminDept],
    ['adminLevelSelect', savedState.adminLevel],
    ['adminDaySelect', savedState.adminDay],
    ['adminHallSelect', savedState.adminHall],
    ['adminTimeSelect', savedState.adminTime],
    ['studentDeptSelect', savedState.studentDept],
    ['studentLevelSelect', savedState.studentLevel]
  ];

  selects.forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el && value) {
      el.value = value;
    }
  });

  if (savedState.currentView && views.includes(savedState.currentView)) {
    switchView(savedState.currentView);
  } else {
    switchView('gatewayScreen');
  }
}

function switchView(targetId) {
  if (!views.includes(targetId)) return;
  currentView = targetId;
  views.forEach((view) => document.getElementById(view).classList.add('hidden'));
  document.getElementById(targetId).classList.remove('hidden');
  document.getElementById('logoutBtn').classList.toggle('hidden', targetId === 'gatewayScreen' || targetId === 'adminLoginScreen' || targetId === 'studentLoginScreen');
  saveUIState();
}

function setAdminStatus(message, tone = 'info') {
  const banner = document.getElementById('adminStatusMessage');
  if (!banner) return;

  if (!message) {
    banner.classList.add('hidden');
    banner.textContent = '';
    return;
  }

  banner.textContent = message;
  banner.className = 'mb-4 rounded-lg border px-3 py-2 text-sm';

  if (tone === 'success') {
    banner.classList.add('border-emerald-200', 'bg-emerald-50', 'text-emerald-800');
  } else if (tone === 'error') {
    banner.classList.add('border-rose-200', 'bg-rose-50', 'text-rose-800');
  } else {
    banner.classList.add('border-yellow-200', 'bg-yellow-50', 'text-yellow-800');
  }
}

function updateAdminUI() {
  const body = document.getElementById('adminTableBody');
  const blank = document.getElementById('adminEmptyState');
  body.innerHTML = '';

  if (!allocationsDB.length) {
    blank.classList.remove('hidden');
    return;
  }

  blank.classList.add('hidden');

  allocationsDB.forEach((item) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50';
    tr.innerHTML = `<td class="p-3 font-bold text-yellow-700">${item.day}<span class="block text-[10px] font-normal text-slate-400">${item.time}</span></td><td class="p-3 font-semibold text-slate-700">${item.hall}</td><td class="p-3"><span class="font-medium text-slate-900">${item.department}</span><span class="block text-[11px] text-slate-500">${item.level}</span></td>`;
    body.appendChild(tr);
  });
}

function renderStudentView(dept, level) {
  document.getElementById('studentTitleDisplay').textContent = `${dept} — (${level})`;
  const body = document.getElementById('studentTableBody');
  const blank = document.getElementById('studentEmptyState');
  body.innerHTML = '';

  const filtered = allocationsDB.filter((a) => a.department === dept && a.level === level);
  if (!filtered.length) {
    blank.classList.remove('hidden');
    return;
  }

  blank.classList.add('hidden');
  filtered.sort((a, b) => a.day.localeCompare(b.day));

  filtered.forEach((item) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50';
    tr.innerHTML = `<td class="p-3 font-bold text-slate-900">${item.day}</td><td class="p-3 text-slate-600">${item.time}</td><td class="p-3 font-bold text-emerald-700">${item.hall}</td>`;
    body.appendChild(tr);
  });
}

popSelect('adminDeptSelect', departments);
popSelect('studentDeptSelect', departments);
popSelect('adminLevelSelect', levels);
popSelect('studentLevelSelect', levels);
popSelect('adminHallSelect', halls);

['adminDeptSelect', 'adminLevelSelect', 'adminDaySelect', 'adminHallSelect', 'adminTimeSelect', 'studentDeptSelect', 'studentLevelSelect'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('change', saveUIState);
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  setAdminStatus('', 'info');
  switchView('gatewayScreen');
});

document.getElementById('homeFromAdminBtn')?.addEventListener('click', () => {
  setAdminStatus('', 'info');
  switchView('gatewayScreen');
});

document.getElementById('showPasswordToggle')?.addEventListener('click', function () {
  const passwordInput = document.getElementById('adminPass');
  const isVisible = passwordInput.type === 'text';
  passwordInput.type = isVisible ? 'password' : 'text';
  this.textContent = isVisible ? 'Show' : 'Hide';
});

document.getElementById('adminLoginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const err = document.getElementById('loginError');
  if (document.getElementById('adminUser').value === 'admin' && document.getElementById('adminPass').value === 'divine2008') {
    err.classList.add('hidden');
    this.reset();
    switchView('adminDashboard');
    updateAdminUI();
    setAdminStatus('Welcome, Admin. Your allocation workspace is ready.', 'success');
  } else {
    err.textContent = '❌ Invalid Official Admin Credentials!';
    err.classList.remove('hidden');
    setAdminStatus('', 'info');
  }
});

document.getElementById('studentLoginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const dept = document.getElementById('studentDeptSelect').value;
  const lvl = document.getElementById('studentLevelSelect').value;
  switchView('studentDashboard');
  renderStudentView(dept, lvl);
});

document.getElementById('allocationForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const alert = document.getElementById('alertBox');
  const pack = {
    department: document.getElementById('adminDeptSelect').value,
    level: document.getElementById('adminLevelSelect').value,
    day: document.getElementById('adminDaySelect').value,
    hall: document.getElementById('adminHallSelect').value,
    time: document.getElementById('adminTimeSelect').value
  };

  const requiredFields = [pack.department, pack.level, pack.day, pack.hall, pack.time];
  if (requiredFields.some((field) => !field)) {
    alert.classList.remove('hidden');
    alert.classList.add('bg-amber-50', 'text-amber-800', 'border', 'border-amber-200');
    alert.textContent = '⚠️ Please complete every allocation field before submitting.';
    return;
  }

  const hallConflict = allocationsDB.find((a) => a.day === pack.day && a.time === pack.time && a.hall === pack.hall);
  const classConflict = allocationsDB.find((a) => a.day === pack.day && a.time === pack.time && a.department === pack.department && a.level === pack.level);

  alert.className = 'p-3 text-xs rounded-lg font-medium ';
  if (hallConflict) {
    alert.classList.remove('hidden');
    alert.classList.add('bg-rose-50', 'text-rose-800', 'border', 'border-rose-200');
    alert.textContent = `🛑 Space Conflict: ${pack.hall} is occupied by ${hallConflict.department} (${hallConflict.level})!`;
    return;
  }

  if (classConflict) {
    alert.classList.remove('hidden');
    alert.classList.add('bg-rose-50', 'text-rose-800', 'border', 'border-rose-200');
    alert.textContent = `🛑 Double Booking: ${pack.department} ${pack.level} is already scheduled in room ${classConflict.hall}!`;
    return;
  }

  allocationsDB.push(pack);
  localStorage.setItem('onu_poly_allocations', JSON.stringify(allocationsDB));
  alert.classList.remove('hidden');
  alert.classList.add('bg-emerald-50', 'text-emerald-800', 'border', 'border-emerald-200');
  alert.textContent = `🎉 Success! Assigned ${pack.hall} seamlessly.`;
  updateAdminUI();
  this.reset();
});

document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm('Wipe total structural allocation records? This action cannot be undone.')) {
    allocationsDB = [];
    localStorage.removeItem('onu_poly_allocations');
    updateAdminUI();
    document.getElementById('alertBox').classList.add('hidden');
  }
});

restoreUIState();
