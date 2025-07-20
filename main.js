// Эта функция вызывается Telegram Login виджетом из index.html
function onTelegramAuth(user) {
  const name = user.first_name + (user.last_name ? ' ' + user.last_name : '');
  document.getElementById('auth-name').innerText = 'Привет, ' + name + '!';
  document.getElementById('flight-form').style.display = 'block';
}

// Загружаем сохранённые полёты
const flights = JSON.parse(localStorage.getItem('flights') || '[]');

// Рендерим список
function renderFlights() {
  const list = document.getElementById('flight-list');
  list.innerHTML = '';
  flights.forEach((f) => {
    const li = document.createElement('li');
    li.innerHTML = `📅 <b>${f.date}</b> — ✈️ ${f.type} — ⏱ ${f.time} ч — ${f.comment || ''} ${f.pdf ? '📎 ' + f.pdf : ''}`;
    list.appendChild(li);
  });
}

// Обработка формы
function addFlight(e) {
  e.preventDefault();
  const form = e.target;
  const date = form.date.value;
  const type = form.type.value;
  const time = form.time.value;
  const comment = form.comment.value;
  const pdf = for
