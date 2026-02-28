const newsContainer = document.getElementById('news-list');
const newsTopicFilter = document.getElementById('news-topic-filter');
let allNews = [];
let offset = 0;

const RAPID_API_KEY = 'c9223ca280msha4c78694d9dfc40p15092fjsncd500e3cf081';
const RAPID_API_HOST = 'real-time-news-data.p.rapidapi.com';
const RAPID_API_URL = `https://${RAPID_API_HOST}/search?query=India%20government%20schemes%20economy%20science%20technology%20awards%20sports%20Himachal&limit=20&lang=en`;

function topicFromText(text) {
  const normalized = text.toLowerCase();
  if (normalized.includes('scheme') || normalized.includes('yojana')) return 'government_schemes';
  if (normalized.includes('economy') || normalized.includes('budget') || normalized.includes('gdp')) return 'economy';
  if (normalized.includes('science') || normalized.includes('technology') || normalized.includes('cyber')) return 'science_technology';
  if (normalized.includes('award') || normalized.includes('honour')) return 'awards';
  if (normalized.includes('sports') || normalized.includes('medal')) return 'sports';
  if (normalized.includes('himachal') || normalized.includes('hp')) return 'himachal_current';
  return 'government_schemes';
}

function topicLabel(topic) {
  const labels = {
    government_schemes: 'Government Schemes / सरकारी योजनाएँ',
    economy: 'Economy / अर्थव्यवस्था',
    science_technology: 'Science & Technology / विज्ञान और प्रौद्योगिकी',
    awards: 'Awards / पुरस्कार',
    sports: 'Sports / खेल',
    himachal_current: 'Himachal Current Affairs / हिमाचल समसामयिकी',
  };
  return labels[topic] || labels.government_schemes;
}

function toBilingual(item) {
  const englishTitle = item.title || item.title_en || 'Current Affairs Update';
  const englishDesc = item.description || item.snippet || item.description_en || 'Detailed update for exam preparation.';
  const topic = item.topic || topicFromText(`${englishTitle} ${englishDesc}`);

  return {
    topic,
    topic_label: item.topic_label || topicLabel(topic),
    title_en: englishTitle,
    title_hi: item.title_hi || `हिंदी सार: ${englishTitle}`,
    description_en: englishDesc,
    description_hi: item.description_hi || `हिंदी सार: ${englishDesc}`,
    source: item.source || item.source_name || 'RapidAPI News',
    url: item.url || '#',
    date: item.date || (item.published_datetime_utc || new Date().toISOString().slice(0, 10)),
  };
}

async function fetchRapidApiNews() {
  const response = await fetch(RAPID_API_URL, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': RAPID_API_HOST,
    },
  });

  if (!response.ok) {
    throw new Error(`RapidAPI request failed: ${response.status}`);
  }

  const payload = await response.json();
  const rows = payload.data || payload.articles || [];
  return rows.map((row) => toBilingual(row));
}

function examRelevant(item) {
  const text = `${item.title_en} ${item.description_en} ${item.title_hi} ${item.description_hi}`.toLowerCase();
  const keywords = [
    'scheme', 'economy', 'technology', 'award', 'sports', 'cyber', 'himachal', 'office',
    'योजना', 'अर्थव्यवस्था', 'प्रौद्योगिकी', 'पुरस्कार', 'खेल', 'साइबर', 'हिमाचल', 'कार्यालय',
  ];
  const text = `${item.title} ${item.description}`.toLowerCase();
  const keywords = ['scheme', 'economy', 'technology', 'award', 'sports', 'cyber', 'himachal', 'office'];
  return keywords.some((k) => text.includes(k));
}

function renderNews() {
  if (!newsContainer || allNews.length === 0) return;
  newsContainer.innerHTML = '';

  const topic = newsTopicFilter?.value || 'all';
  let relevant = allNews.filter(examRelevant);
  if (topic !== 'all') relevant = relevant.filter((item) => item.topic === topic);

  const display = relevant.slice(offset, offset + 5);
  display.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'news-item';
    li.innerHTML = `
      <a target="_blank" href="${item.url}">
        <span class="news-title-en">${item.title_en}</span>
        <span class="news-title-hi">${item.title_hi}</span>
      </a>
      <p class="news-desc-en">${item.description_en}</p>
      <p class="news-desc-hi">${item.description_hi}</p>
      <small>${item.source} • ${item.date} • ${item.topic_label}</small>
    `;
    newsContainer.appendChild(li);
  });

  const relevant = allNews.filter(examRelevant);
  const display = relevant.slice(offset, offset + 5);
  display.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `<a target="_blank" href="${item.url}">${item.title}</a><small>${item.source} • ${item.date}</small>`;
    newsContainer.appendChild(li);
  });
  offset = (offset + 1) % Math.max(1, relevant.length - 4);
}

async function initDashboard() {
  try {
    allNews = await fetchRapidApiNews();
  } catch (_err) {
    const localNews = await loadJson('./data/news.json');
    allNews = localNews.map((item) => toBilingual(item));
  }

  allNews = await loadJson('./data/news.json');
  renderNews();
  setInterval(renderNews, 15000);
}

newsTopicFilter?.addEventListener('change', () => {
  offset = 0;
  renderNews();
});

initDashboard().catch(() => {
  if (newsContainer) newsContainer.innerHTML = '<li>Unable to load current affairs data from RapidAPI and local fallback.</li>';
  if (newsContainer) newsContainer.innerHTML = '<li>Unable to load detailed bilingual current affairs data.</li>';
initDashboard().catch(() => {
  if (newsContainer) newsContainer.innerHTML = '<li>Unable to load current affairs data.</li>';
});
