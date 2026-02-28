const startBtn = document.getElementById('start-mock');
const refreshBtn = document.getElementById('refresh-mock');
const submitBtn = document.getElementById('submit-mock');
const timerEl = document.getElementById('mock-timer');
const mockContainer = document.getElementById('mock-container');
const mockSourceLabel = document.getElementById('mock-source');
const mockDifficultyFilter = document.getElementById('mock-difficulty-filter');

let mockQuestions = [];
let duration = 60 * 60;
let timerId;
let questionBank = [];
let seenMockSession = new Set();

function qText(q) {
  return `${q.question_en || q.question}<br><span class="text-hi">${q.question_hi || ''}</span><br><span class="chip">${q.topic}</span> <span class="chip">${q.difficulty}</span>`;
}

function optText(q, opt) {
  return `${q[`option_${opt.toLowerCase()}_en`] || q[`option_${opt.toLowerCase()}`]}<br><span class="text-hi">${q[`option_${opt.toLowerCase()}_hi`] || ''}</span>`;

function qText(q) {
  return `${q.question_en}<br><span class="text-hi">${q.question_hi || ''}</span>`;
}

function optText(q, opt) {
  return `${q[`option_${opt.toLowerCase()}_en`] || q['option_' + opt.toLowerCase()]}<br><span class="text-hi">${q[`option_${opt.toLowerCase()}_hi`] || ''}</span>`;
}

function renderMock() {
  mockContainer.innerHTML = '';
  mockQuestions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'card question-card';
    card.innerHTML = `<p><strong>${idx + 1}.</strong> ${qText(q)}</p>
      ${['A', 'B', 'C', 'D'].map((opt) =>
        `<label><input type="radio" name="m_${q.id}" value="${opt}"> ${optText(q, opt)}</label>`
    card.className = 'card';
    card.innerHTML = `<p><strong>${idx + 1}.</strong> ${qText(q)}</p>
      ${['A', 'B', 'C', 'D'].map((opt) =>
        `<label><input type="radio" name="m_${q.id}" value="${opt}"> ${optText(q, opt)}</label>`
    card.innerHTML = `<p><strong>${idx + 1}.</strong> ${q.question}</p>
      ${['A', 'B', 'C', 'D'].map((opt) =>
        `<label><input type="radio" name="m_${q.id}" value="${opt}"> ${q['option_' + opt.toLowerCase()]}</label>`
      ).join('')}`;
    mockContainer.appendChild(card);
  });
}

function tick() {
  duration -= 1;
  const mm = String(Math.floor(duration / 60)).padStart(2, '0');
  const ss = String(duration % 60).padStart(2, '0');
  timerEl.textContent = `Time Left: ${mm}:${ss}`;
  if (duration <= 0) submitMock();
}

function generateMockSet() {
  const difficulty = mockDifficultyFilter.value;
  let pool = questionBank.filter((q) => !seenMockSession.has(q.id));
  if (difficulty !== 'all') pool = pool.filter((q) => q.difficulty === difficulty);

  if (pool.length < 50) {
    seenMockSession = new Set();
    pool = [...questionBank];
    if (difficulty !== 'all') pool = pool.filter((q) => q.difficulty === difficulty);
  }

  mockQuestions = [...pool].sort(() => 0.5 - Math.random()).slice(0, 50);
  mockQuestions.forEach((q) => seenMockSession.add(q.id));
  renderMock();
}

async function startMock() {
  mockQuestions = [...questionBank].sort(() => 0.5 - Math.random()).slice(0, 50);
  renderMock();
}

function startMock() {
  const user = currentUser();
  if (!user) return alert('Please login first.');

  if (questionBank.length === 0) {
    const loaded = await loadQuestionBank({ amount: 100 });
    questionBank = loaded.questions;
    if (mockSourceLabel) mockSourceLabel.textContent = `Question source: ${loaded.source} | Syllabus-only filter active`;
    loadJson('./data/questions.json').then((bank) => {
      questionBank = bank;
      generateMockSet();
      duration = 60 * 60;
      clearInterval(timerId);
      timerId = setInterval(tick, 1000);
    });
    return;
  }

  generateMockSet();
  duration = 60 * 60;
  clearInterval(timerId);
  timerId = setInterval(tick, 1000);
}

function refreshMockQuestions() {
  const user = currentUser();
  if (!user) return alert('Please login first.');
  if (questionBank.length === 0) return alert('Start mock first.');
  generateMockSet();
  loadJson('./data/questions.json').then((bank) => {
    mockQuestions = [...bank].sort(() => 0.5 - Math.random()).slice(0, 50);
    duration = 60 * 60;
    renderMock();
    clearInterval(timerId);
    timerId = setInterval(tick, 1000);
  });
}

function submitMock() {
  clearInterval(timerId);
  if (mockQuestions.length === 0) return;

  let score = 0;
  mockQuestions.forEach((q) => {
    const selected = document.querySelector(`input[name="m_${q.id}"]:checked`)?.value;
    if (selected === q.correct_option) score += 1;
  });

  const user = currentUser();
  const performance = getData(STORAGE_KEYS.performance, []);
  performance.push({
    email: user.email,
    module: 'mock',
    score,
    total: mockQuestions.length,
    percent: Number(((score / mockQuestions.length) * 100).toFixed(2)),
    at: Date.now(),
  });
  performance.push({ email: user.email, module: 'mock', score, total: mockQuestions.length, percent: Number(((score / mockQuestions.length) * 100).toFixed(2)), at: Date.now() });
  setData(STORAGE_KEYS.performance, performance);

  alert(`Mock Result: ${score}/${mockQuestions.length}`);
}

startBtn?.addEventListener('click', startMock);
refreshBtn?.addEventListener('click', refreshMockQuestions);
submitBtn?.addEventListener('click', submitMock);
mockDifficultyFilter?.addEventListener('change', refreshMockQuestions);
