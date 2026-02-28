const QUIZ_API_KEY = 'S9o5ZfqTjfHCY6BRV7596PsC3NhFmB5vWgVSeTut';
const QUIZ_API_URL = `https://quizapi.io/api/v1/questions?apiKey=${QUIZ_API_KEY}&limit=80`;
const OPEN_TDB_URL = 'https://opentdb.com/api.php?amount=80&type=multiple';

const SYLLABUS_TOPICS = new Set([
  'current_affairs',
  'ms_office',
  'dbms',
  'networking',
  'cyber_security',
  'himachal_gk',
  'computer_basics',
  'internet',
  'windows',
]);

function decodeHtml(text = '') {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeDifficulty(value = '') {
  const v = String(value).toLowerCase();
  if (v.includes('easy')) return 'easy';
  if (v.includes('medium')) return 'medium';
  if (v.includes('hard')) return 'hard';
  return 'medium';
}

function topicFromQuestionText(text = '') {
  const v = text.toLowerCase();
  if (v.includes('excel') || v.includes('office') || v.includes('word') || v.includes('powerpoint')) return 'ms_office';
  if (v.includes('sql') || v.includes('database') || v.includes('dbms') || v.includes('table') || v.includes('query')) return 'dbms';
  if (v.includes('network') || v.includes('ip') || v.includes('dns') || v.includes('router') || v.includes('lan') || v.includes('vpn')) return 'networking';
  if (v.includes('cyber') || v.includes('security') || v.includes('phishing') || v.includes('malware') || v.includes('firewall')) return 'cyber_security';
  if (v.includes('himachal') || v.includes('shimla') || v.includes('kullu') || v.includes('hp')) return 'himachal_gk';
  if (v.includes('budget') || v.includes('g20') || v.includes('rbi') || v.includes('india') || v.includes('current affairs')) return 'current_affairs';
  if (v.includes('computer') || v.includes('hardware') || v.includes('software') || v.includes('operating system')) return 'computer_basics';
  if (v.includes('internet') || v.includes('browser') || v.includes('email') || v.includes('www')) return 'internet';
  if (v.includes('windows')) return 'windows';
  return null;
}

function isSyllabusQuestion(topic) {
  return SYLLABUS_TOPICS.has(topic);
}

function normalizeQuestion({ id, topic, question, optionA, optionB, optionC, optionD, correct, difficulty = 'medium' }) {
  if (!isSyllabusQuestion(topic)) return null;
  if (!question || !optionA || !optionB || !optionC || !optionD) return null;

  return {
    id,
    topic,
    difficulty: normalizeDifficulty(difficulty),
    question,
    question_en: question,
    question_hi: `हिंदी सार: ${question}`,
    option_a: optionA,
    option_b: optionB,
    option_c: optionC,
    option_d: optionD,
    option_a_en: optionA,
    option_b_en: optionB,
    option_c_en: optionC,
    option_d_en: optionD,
    option_a_hi: `हिंदी सार: ${optionA}`,
    option_b_hi: `हिंदी सार: ${optionB}`,
    option_c_hi: `हिंदी सार: ${optionC}`,
    option_d_hi: `हिंदी सार: ${optionD}`,
    correct_option: correct,
  };
}

function mapQuizApi(rows = []) {
  return rows
    .map((q, idx) => {
      const answers = q.answers || {};
      const candidates = [answers.answer_a, answers.answer_b, answers.answer_c, answers.answer_d].filter(Boolean);
      if (candidates.length < 4) return null;

      const correctAnswers = q.correct_answers || {};
      let correct = 'A';
      if (correctAnswers.answer_b_correct === 'true') correct = 'B';
      if (correctAnswers.answer_c_correct === 'true') correct = 'C';
      if (correctAnswers.answer_d_correct === 'true') correct = 'D';

      const questionText = q.question || 'QuizAPI Question';
      const topic = topicFromQuestionText(questionText);

      return normalizeQuestion({
        id: `quizapi_${q.id || idx + 1}`,
        topic,
        question: questionText,
        optionA: candidates[0],
        optionB: candidates[1],
        optionC: candidates[2],
        optionD: candidates[3],
        correct,
        difficulty: q.difficulty || 'medium',
      });
    })
    .filter(Boolean);
}

function mapOpenTdb(rows = []) {
  return rows
    .map((q, idx) => {
      const all = shuffleArray([q.correct_answer, ...(q.incorrect_answers || [])]).map((x) => decodeHtml(x));
      const question = decodeHtml(q.question || 'OpenTDB Question');
      const correctText = decodeHtml(q.correct_answer || '');
      const correctIndex = all.findIndex((x) => x === correctText);
      const correct = ['A', 'B', 'C', 'D'][Math.max(0, correctIndex)];
      const topic = topicFromQuestionText(question);

      return normalizeQuestion({
        id: `opentdb_${idx + 1}`,
        topic,
        question,
        optionA: all[0],
        optionB: all[1],
        optionC: all[2],
        optionD: all[3],
        correct,
        difficulty: q.difficulty || 'medium',
      });
    })
    .filter(Boolean);
}

function mapLocal(rows = []) {
  return rows
    .map((q, idx) => {
      const topic = q.topic && isSyllabusQuestion(q.topic) ? q.topic : topicFromQuestionText(q.question_en || q.question || '');
      return normalizeQuestion({
        id: q.id || `local_${idx + 1}`,
        topic,
        question: q.question_en || q.question,
        optionA: q.option_a_en || q.option_a,
        optionB: q.option_b_en || q.option_b,
        optionC: q.option_c_en || q.option_c,
        optionD: q.option_d_en || q.option_d,
        correct: q.correct_option,
        difficulty: q.difficulty || 'medium',
      });
    })
    .filter(Boolean);
}

async function loadQuestionBank({ amount = 80 } = {}) {
  try {
    const res = await fetch(QUIZ_API_URL);
    if (!res.ok) throw new Error('QuizAPI failed');
    const payload = await res.json();
    const mapped = mapQuizApi(payload).slice(0, amount);
    if (mapped.length > 0) return { questions: mapped, source: 'QuizAPI.io' };
  } catch (_err) {}

  try {
    const res = await fetch(OPEN_TDB_URL);
    if (!res.ok) throw new Error('OpenTDB failed');
    const payload = await res.json();
    const mapped = mapOpenTdb(payload.results || []).slice(0, amount);
    if (mapped.length > 0) return { questions: mapped, source: 'OpenTDB' };
  } catch (_err) {}

  const local = await loadJson('./data/questions.json');
  return { questions: mapLocal(local).slice(0, amount), source: 'Local Dataset' };
}
