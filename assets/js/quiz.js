const quizContainer = document.getElementById('quiz-container');
const submitQuizButton = document.getElementById('submit-quiz');
const refreshQuizButton = document.getElementById('refresh-quiz');
const topicFilter = document.getElementById('topic-filter');
const difficultyFilter = document.getElementById('difficulty-filter');
const quizUser = document.getElementById('quiz-user');
const questionSourceLabel = document.getElementById('question-source');

let questionBank = [];
let currentSet = [];
let seenInSession = new Set();

function getAttemptedSet(email) {
  const attempts = getData(STORAGE_KEYS.attempts, {});
  return new Set(attempts[email] || []);
}

function rememberAttempts(email, questionIds) {
  const attempts = getData(STORAGE_KEYS.attempts, {});
  attempts[email] = [...new Set([...(attempts[email] || []), ...questionIds])];
  setData(STORAGE_KEYS.attempts, attempts);
}

function pickQuestions(topic = 'all', difficulty = 'all') {
  const user = currentUser();
  if (!user) return [];

  const attempted = getAttemptedSet(user.email);
  let pool = questionBank.filter((q) => !attempted.has(q.id) && !seenInSession.has(q.id));
  if (topic !== 'all') pool = pool.filter((q) => q.topic === topic);
  if (difficulty !== 'all') pool = pool.filter((q) => q.difficulty === difficulty);

  if (pool.length < 10) {
    seenInSession = new Set();
    pool = questionBank.filter((q) => !attempted.has(q.id));
    if (topic !== 'all') pool = pool.filter((q) => q.topic === topic);
    if (difficulty !== 'all') pool = pool.filter((q) => q.difficulty === difficulty);
  }

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picked = pool.slice(0, 10);
  picked.forEach((q) => seenInSession.add(q.id));
  return picked;
}

function qText(q) {
  return `${q.question_en || q.question}<br><span class="text-hi">${q.question_hi || ''}</span><br><span class="chip">${q.topic}</span> <span class="chip">${q.difficulty}</span>`;
}

function optText(q, opt) {
  const en = q[`option_${opt.toLowerCase()}_en`] || q[`option_${opt.toLowerCase()}`];
  const hi = q[`option_${opt.toLowerCase()}_hi`] || '';
  return `${en}<br><span class="text-hi">${hi}</span>`;
}

function renderQuiz(questions) {
  if (!quizContainer) return;
  quizContainer.innerHTML = '';
  if (questions.length === 0) {
    quizContainer.innerHTML = '<p>No syllabus-matched fresh questions available for selected filters.</p>';
    return;
  }

  questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'card question-card';
    card.innerHTML = `<p><strong>Q${idx + 1}.</strong> ${qText(q)}</p>
      ${['A', 'B', 'C', 'D'].map((opt) =>
        `<label><input type="radio" name="q_${q.id}" value="${opt}"> ${optText(q, opt)}</label>`
      ).join('')}`;
    quizContainer.appendChild(card);
  });
}

function savePerformance(email, module, score, total) {
  const performance = getData(STORAGE_KEYS.performance, []);
  performance.push({ email, module, score, total, percent: Number(((score / total) * 100).toFixed(2)), at: Date.now() });
  setData(STORAGE_KEYS.performance, performance);
}

function loadQuiz() {
  const user = currentUser();
  if (!user) {
    quizContainer.innerHTML = '<p>Please login first.</p>';
    return;
  }

  quizUser.textContent = `Logged in: ${user.name}`;
  currentSet = pickQuestions(topicFilter.value, difficultyFilter.value);
  renderQuiz(currentSet);
}

function submitQuiz() {
  const user = currentUser();
  if (!user || currentSet.length === 0) return;

  let score = 0;
  currentSet.forEach((q) => {
    const selected = document.querySelector(`input[name="q_${q.id}"]:checked`)?.value;
    if (selected === q.correct_option) score += 1;
  });

  rememberAttempts(user.email, currentSet.map((q) => q.id));
  savePerformance(user.email, 'quiz', score, currentSet.length);
  alert(`Score: ${score}/${currentSet.length}`);
  loadQuiz();
}

async function initQuiz() {
  const loaded = await loadQuestionBank({ amount: 80 });
  questionBank = loaded.questions;
  if (questionSourceLabel) questionSourceLabel.textContent = `Question source: ${loaded.source} | Syllabus-only filter active`;
  loadQuiz();
}

refreshQuizButton?.addEventListener('click', loadQuiz);
submitQuizButton?.addEventListener('click', submitQuiz);
topicFilter?.addEventListener('change', loadQuiz);
difficultyFilter?.addEventListener('change', loadQuiz);
initQuiz();
