// Функция вызывается Telegram Login виджетом после авторизации
function onTelegramAuth(user) {
  const name = user.first_name + (user.last_name ? ' ' + user.last_name : '');
  document.getElementById('auth-name').innerText = 'Привет, ' + name + '!';
  document.getElementById('flight-form').style.display = 'block';
}

// Хранилище записей
const flights = JSON.parse(localStorage.getItem('flights') || '[]');

// Отображение списка полётов
function renderFlights() {
  const list = document.getElementById('flight-list');
  list.innerHTML = '';
  flights.forEach((f) => {
    const li = document.createElement('li');
    li.innerHTML = `📅 <b>${f.date}</b> — ✈️ ${f.type} — ⏱ ${f.time} ч — ${f.comment || ''} ${f.pdf ? '📎 ' + f.pdf : ''}`;
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

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
  const formEl = document.getElementById('flight-form');
  if (formEl) {
    formEl.addEventListener('submit', addFlight);
  }
  renderFlights();
});

// 👇 Ключевой момент: делаем функцию доступной для Telegram-виджета
window.onTelegramAuth = onTelegramAuth;
