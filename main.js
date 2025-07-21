function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
  document.getElementById(id).classList.add('active-page');
}

let flights = JSON.parse(localStorage.getItem('flights') || '[]');

function renderFlights(filter = '') {
  const list = document.getElementById('flight-list');
  list.innerHTML = '';

  const filtered = flights.filter(f => {
    const search = filter.toLowerCase();
    return (
      f.tail?.toLowerCase().includes(search) ||
      f.crew?.toLowerCase().includes(search) ||
      f.route?.toLowerCase().includes(search) ||
      f.type?.toLowerCase().includes(search) ||
      f.comment?.toLowerCase().includes(search)
    );
  });

  filtered.forEach(f => {
    const li = document.createElement('li');
    li.innerHTML = `
      📅 <b>${f.date}</b> — ✈️ ${f.type} — Борт: ${f.tail} — ⏱ ${f.time} ч<br/>
      👥 ${f.crew || '-'}<br/>
      🌍 ${f.route || '-'}<br/>
      ${f.comment ? '💬 ' + f.comment + '<br/>' : ''}
      ${f.pdf ? '📎 ' + f.pdf : ''}
    `;
    list.appendChild(li);
  });
}

function renderStats() {
  const summary = {};
  flights.forEach(f => {
    summary[f.type] = (summary[f.type] || 0) + parseFloat(f.time.replace(':', '.'));
  });
  const list = document.getElementById('stats-list');
  list.innerHTML = '';
  for (const type in summary) {
    const li = document.createElement('li');
    li.innerText = `${type}: ${summary[type].toFixed(1)} ч`;
    list.appendChild(li);
  }
}

function saveFlights() {
  localStorage.setItem('flights', JSON.stringify(flights));
}

function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const flight = {
    date: form.date.value,
    type: form.type.value,
    tail: form.tail.value,
    crew: form.crew.value,
    route: form.route.value,
    time: form.time.value,
    comment: form.comment.value,
    pdf: form.pdf.files[0]?.name || ''
  };
  flights.push(flight);
  saveFlights();
  renderFlights(document.getElementById('search-input').value);
  form.reset();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('flight-form').addEventListener('submit', handleSubmit);
  document.getElementById('search-input').addEventListener('input', (e) => {
    renderFlights(e.target.value);
  });
  renderFlights();
  renderStats();
});
