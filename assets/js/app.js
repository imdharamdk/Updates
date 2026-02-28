const STORAGE_KEYS = {
  users: 'joa_users',
  currentUser: 'joa_current_user',
  attempts: 'joa_attempts',
  performance: 'joa_performance',
};

function getData(key, fallback) {
  return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function currentUser() {
  return getData(STORAGE_KEYS.currentUser, null);
}

async function sha256(value) {
  const enc = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
  return [...new Uint8Array(hashBuffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function updateAuthNav() {
  const link = document.getElementById('auth-link');
  if (!link) return;
  const user = currentUser();
  link.textContent = user ? `Hi, ${user.name}` : 'Login';
  link.href = 'login.html';
}

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./offline/service-worker.js'));
}
window.addEventListener('DOMContentLoaded', updateAuthNav);
