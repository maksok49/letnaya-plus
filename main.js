function onTelegramAuth(user) {
  const name = user.first_name + (user.last_name ? ' ' + user.last_name : '');
  document.getElementById('app').innerText = 'Привет, ' + name + '!';
}

const script = document.createElement('script');
script.src = 'https://telegram.org/js/telegram-widget.js?7';
script.setAttribute('data-telegram-login', 'trueletnaya_bot');
script.setAttribute('data-size', 'large');
script.setAttribute('data-userpic', 'false');
script.setAttribute('data-request-access', 'write');
script.setAttribute('data-onauth', 'onTelegramAuth(user)');
document.body.appendChild(script);

const flights = JSON.parse(localStorage.getItem('flights') || '[]');

function renderFlights() {
  const list = document.getElementById('flight-list');
  list.innerHTML = '';
  flights.forEach((f) => {
    const li = document.createElement('li');
    li.innerHTML = `📅 <b>${f.date}</b> — ✈️ ${f.type} — ⏱ ${f.time} ч — ${f.comment || ''} ${f.pdf ? '📎 ' + f.pdf : ''}`;
    list.appendChild(li);
  });
}

function addFlight(e) {
  e.preventDefault();
  const form = e.target;
  const date = form.date.value;
  const type = form.type.value;
  const time = form.time.value;
  const comment = form.comment.value;
  const pdf = form.pdf.files[0]?.name || '';

  const newFlight = { date, type, time, comment, pdf };
  flights.push(newFlight);
  localStorage.setItem('flights', JSON.stringify(flights));
  renderFlights();
  form.reset();
}

document.addEventListener('DOMContentLoaded', () => {
  const formEl = document.getElementById('flight-form');
  if (formEl) {
    formEl.addEventListener('submit', addFlight);
  }
  renderFlights();
});

