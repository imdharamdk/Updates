const newsContainer = document.getElementById('news-list');
let allNews = [];
let offset = 0;

function examRelevant(item) {
  const text = `${item.title} ${item.description}`.toLowerCase();
  const keywords = ['scheme', 'economy', 'technology', 'award', 'sports', 'cyber', 'himachal', 'office'];
  return keywords.some((k) => text.includes(k));
}

function renderNews() {
  if (!newsContainer || allNews.length === 0) return;
  newsContainer.innerHTML = '';
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
  allNews = await loadJson('./data/news.json');
  renderNews();
  setInterval(renderNews, 15000);
}

initDashboard().catch(() => {
  if (newsContainer) newsContainer.innerHTML = '<li>Unable to load current affairs data.</li>';
});
