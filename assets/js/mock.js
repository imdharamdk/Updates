const startBtn = document.getElementById('start-mock');
const submitBtn = document.getElementById('submit-mock');
const timerEl = document.getElementById('mock-timer');
const mockContainer = document.getElementById('mock-container');

let mockQuestions = [];
let duration = 60 * 60;
let timerId;

function renderMock() {
  mockContainer.innerHTML = '';
  mockQuestions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
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

function startMock() {
  const user = currentUser();
  if (!user) return alert('Please login first.');

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
  performance.push({ email: user.email, module: 'mock', score, total: mockQuestions.length, percent: Number(((score / mockQuestions.length) * 100).toFixed(2)), at: Date.now() });
  setData(STORAGE_KEYS.performance, performance);

  alert(`Mock Result: ${score}/${mockQuestions.length}`);
}

startBtn?.addEventListener('click', startMock);
submitBtn?.addEventListener('click', submitMock);
