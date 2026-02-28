const tbody = document.getElementById('leaderboard-body');

function renderLeaderboard() {
  const performance = getData(STORAGE_KEYS.performance, []);
  const grouped = performance.reduce((acc, row) => {
    if (!acc[row.email]) acc[row.email] = { email: row.email, sum: 0, count: 0 };
    acc[row.email].sum += row.percent;
    acc[row.email].count += 1;
    return acc;
  }, {});

  const ranks = Object.values(grouped)
    .map((x) => ({ user: x.email, avg: Number((x.sum / x.count).toFixed(2)), attempts: x.count }))
    .sort((a, b) => b.avg - a.avg || b.attempts - a.attempts);

  tbody.innerHTML = '';
  ranks.forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${idx + 1}</td><td>${r.user}</td><td>${r.avg}%</td><td>${r.attempts}</td>`;
    tbody.appendChild(tr);
  });
}

renderLeaderboard();
