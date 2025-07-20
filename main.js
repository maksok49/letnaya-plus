// Хранилище записей
let flights = JSON.parse(localStorage.getItem('flights') || '[]');

// Функция вызывается Telegram Login виджетом после авторизации
function onTelegramAuth(user) {
  const name = user.first_name + (user.last_name ? ' ' + user.last_name : '');
  document.getElementById('auth-name').innerText = 'Привет, ' + name + '!';
  document.getElementById('flight-form').style.display = 'block';
  renderFlights(); // Отображаем список полётов после авторизации
}

// Отображение списка полётов
function renderFlights() {
  const list = document.getElementById('flight-list');
  list.innerHTML = '';
  flights.forEach((f) => {
    const li = document.createElement('li');
    li.innerHTML = `
      📅 <b>${f.date}</b> — 
      ✈️ ${f.type} — 
      ⏱ ${f.time} ч — 
      ${f.comment || ''} 
      ${f.pdf ? '📎 ' + f.pdf : ''}
    `;
    list.appendChild(li);
  });
}

// Добавление нового полёта
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

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('flight-form');
  form.addEventListener('submit', addFlight);
});

// Добавляем window.onTelegramAuth для Telegram
window.onTelegramAuth = onTelegramAuth;
