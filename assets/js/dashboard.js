const newsContainer = document.getElementById('news-list');
const newsTopicFilter = document.getElementById('news-topic-filter');
let allNews = [];
let offset = 0;

function examRelevant(item) {
  const text = `${item.title_en} ${item.description_en} ${item.title_hi} ${item.description_hi}`.toLowerCase();
  const keywords = [
    'scheme', 'economy', 'technology', 'award', 'sports', 'cyber', 'himachal', 'office',
    'योजना', 'अर्थव्यवस्था', 'प्रौद्योगिकी', 'पुरस्कार', 'खेल', 'साइबर', 'हिमाचल', 'कार्यालय',
  ];
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

  offset = (offset + 1) % Math.max(1, relevant.length - 4);
}

async function initDashboard() {
  allNews = await loadJson('./data/news.json');
  renderNews();
  setInterval(renderNews, 15000);
}

newsTopicFilter?.addEventListener('change', () => {
  offset = 0;
  renderNews();
});

initDashboard().catch(() => {
  if (newsContainer) newsContainer.innerHTML = '<li>Unable to load detailed bilingual current affairs data.</li>';
});
