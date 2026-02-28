const regForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const authStatus = document.getElementById('auth-status');

function showStatus(msg) {
  if (authStatus) authStatus.textContent = msg;
}

regForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(regForm);
  const name = fd.get('name').trim();
  const email = fd.get('email').trim().toLowerCase();
  const password = fd.get('password');

  const users = getData(STORAGE_KEYS.users, []);
  if (users.find((u) => u.email === email)) {
    return showStatus('Email already registered.');
  }

  const passwordHash = await sha256(password);
  users.push({ name, email, passwordHash });
  setData(STORAGE_KEYS.users, users);
  showStatus('Registration successful. Please login.');
  regForm.reset();
});

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(loginForm);
  const email = fd.get('email').trim().toLowerCase();
  const passwordHash = await sha256(fd.get('password'));

  const users = getData(STORAGE_KEYS.users, []);
  const user = users.find((u) => u.email === email && u.passwordHash === passwordHash);
  if (!user) return showStatus('Invalid credentials.');

  setData(STORAGE_KEYS.currentUser, { name: user.name, email: user.email });
  showStatus(`Welcome ${user.name}!`);
  setTimeout(() => (window.location.href = 'index.html'), 600);
});

logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
  showStatus('Logged out successfully.');
});

const user = currentUser();
if (user) showStatus(`Logged in as ${user.name} (${user.email})`);
