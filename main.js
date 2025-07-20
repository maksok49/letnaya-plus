// Хранилище данных
let appData = {
 flights: JSON.parse(localStorage.getItem('flights')) || [],
 history: JSON.parse(localStorage.getItem('history')) || {},
 stats: {
 totalCareer: 0,
 currentYear: new Date().getFullYear(),
 monthlyData: {}
 }
};

// Telegram авторизация
function onTelegramAuth(user) {
 const name = user.first_name + (user.last_name ? ' ' + user.last_name : '');
 document.getElementById('auth-name').textContent = `✈️ ${name}, добро пожаловать!`;
 document.getElementById('flight-form').style.display = 'block';
 document.querySelector('.telegram-widget').style.display = 'none';
 renderFlights();
 updateStatistics();
}

// Рендеринг полётов
function renderFlights(flightsArray = appData.flights) {
 const list = document.getElementById('flight-list');
 list.innerHTML = '';
 
 flightsArray.forEach(flight => {
 const item = document.createElement('li');
 item.className = 'flight-item';
 item.innerHTML = `
 <div class="flight-header">
 <b>${flight.date}</b> | ${flight.type} | ⏱ ${flight.time} ч
 </div>
 <div class="flight-details">
 <b>Маршрут:</b> ${flight.route}<br>
 <b>Экипаж:</b> ${flight.crew.join(', ')}<br>
 ${flight.comment ? `<b>Комментарий:</b> ${flight.comment}<br>` : ''}
 ${flight.pdf ? `📎 Прикреплённый файл: ${flight.pdf}` : ''}
 </div>
 `;
 list.appendChild(item);
 });
}

// Обновление статистики
function updateStatistics() {
 calculateStatistics();
 
 document.getElementById('total-career').textContent = appData.stats.totalCareer.toFixed(1);
 document.getElementById('current-year').textContent = appData.stats.currentYearTotal.toFixed(1);
 document.getElementById('flight-count').textContent = appData.flights.length;
 document.getElementById('crew-count').textContent = [...new Set(appData.flights.flatMap(f => f.crew))].length;
}

// Поиск полётов
function performSearch() {
 const query = document.getElementById('search-input').value.toLowerCase();
 const results = appData.flights.filter(f => 
 f.route.toLowerCase().includes(query) ||
 f.crew.some(member => member.toLowerCase().includes(query)) ||
 f.comment?.toLowerCase().includes(query)
 );
 renderFlights(results);
}

// Фильтр по экипажу
function applyCrewFilter() {
 const filter = document.getElementById('crew-filter').value.toLowerCase().trim();
 const filtered = appData.flights.filter(f => 
 f.crew.some(member => member.toLowerCase().includes(filter))
 );
 renderFlights(filtered);
}

// Добавление нового полёта
document.getElementById('flight-form').addEventListener('submit', function(e) {
 e.preventDefault();
 const formData = new FormData(this);
 
 const newFlight = {
 date: formData.get('date'),
 type: formData.get('type'),
 time: formData.get('time'),
 route: formData.get('route'),
 crew: formData.get('crew').split(',').map(s => s.trim()),
 comment: formData.get('comment'),
 pdf: this.elements.pdf.files0?.name || ''
 };

 appData.flights.push(newFlight);
 localStorage.setItem('flights', JSON.stringify(appData.flights));
 this.reset();
 renderFlights();
 updateStatistics();
});

// Функция добавления исторических часов
function addHistoricalHours() {
 const month = document.getElementById('history-month').value;
 const hours = parseFloat(document.getElementById('history-hours').value);

 if (!month || isNaN(hours)) {
 alert('Заполните все поля корректно!');
 return;
 }

 appData.history[month] = (appData.history[month] || 0) + hours;
 localStorage.setItem('history', JSON.stringify(appData.history));
 updateStatistics();
 renderCharts();
}

// Расширенная статистика
function calculateStatistics() {
 const currentYear = new Date().getFullYear();
 
 // Суммируем текущие полёты
 const currentHours = appData.flights.reduce((acc, f) => {
 const [h, m] = f.time.split(':').map(Number);
 return acc + h + m/60;
 }, 0);

 // Суммируем историю
 let totalHistory = 0;
 let yearlyHistory = 0;
 const monthlyStats = {};

 for (const [month, hours] of Object.entries(appData.history)) {
 totalHistory += hours;
 if (month.startsWith(currentYear)) yearlyHistory += hours;
 
 const year = month.split('-')[0];
 monthlyStats[year] = (monthlyStats[year] || 0) + hours;
 }

 appData.stats = {
 totalCareer: currentHours + totalHistory,
 currentYearTotal: yearlyHistory + currentHours,
 allYears: monthlyStats
 };
}

// Визуализация графиков
let chartInstance;

function renderCharts() {
 const ctx = document.getElementById('statsChart').getContext('2d');
 const years = Object.keys(appData.stats.allYears).sort();
 
 if (chartInstance) chartInstance.destroy();

 chartInstance = new Chart(ctx, {
 type: 'bar',
 data: {
 labels: years,
 datasets: [{
 label: 'Налёт по годам',
 data: years.map(y => appData.stats.allYearsy),
 backgroundColor: 'rgba(75, 192, 192, 0.6)',
 borderColor: 'rgba(75, 192, 192, 1)',
 borderWidth: 1
 }]
 },
 options: {
 responsive: true,
 plugins: {
 legend: { display: false },
 title: { display: true, text: 'Распределение налёта по годам' }
 },
 scales: {
 y: { beginAtZero: true, title: { display: true, text: 'Часы' } }
 }
 }
 });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
 updateStatistics();
 renderCharts();
});
