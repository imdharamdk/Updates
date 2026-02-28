const hpCards = document.getElementById('hp-cards');

async function initHp() {
  const items = await loadJson('./data/himachal_gk.json');
  hpCards.innerHTML = '';
  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${item.title}</h3><p><strong>${item.category}</strong></p><p>${item.content}</p>`;
    hpCards.appendChild(card);
  });
}

initHp();
