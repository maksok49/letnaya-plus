// main.js

// Класс для хранения информации о полете
class Flight {
    constructor(date, type, time, crew, route, details) {
        this.date = date;
        this.type = type;
        this.time = time;
        this.crew = crew || [];
        this.route = route;
        this.details = details || {};
    }
}

// Хранилище данных
let flights = JSON.parse(localStorage.getItem('flights')) || [];

// Функция для расчета времени
function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
}

function formatTime(totalHours) {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Статистика
function updateStatistics() {
    const totalTime = flights.reduce((acc, flight) => {
        return acc + parseTime(flight.time);
    }, 0);
    
    document.getElementById('total-time').innerText = formatTime(totalTime);
    document.getElementById('flight-count').innerText = flights.length;
    
    renderMonthlyStats();
}

function renderMonthlyStats() {
    const monthlyContainer = document.getElementById('monthly-stats');
    monthlyContainer.innerHTML = '';
    
    const months = {};
    flights.forEach(flight => {
        const date = new Date(flight.date);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!months[key]) {
            months[key] = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                time: 0
            };
        }
        months[key].time += parseTime(flight.time);
    });
    
    for (const key in months) {
        const stat = months[key];
        const div = document.createElement('div');
        div.innerText = `${new Date(stat.year, stat.month - 1).toLocaleString('ru', { month: 'long', year: 'numeric' })}: ${formatTime(stat.time)} часов`;
        monthlyContainer.appendChild(div);
    }
}

// Обработка формы
function addFlight(e) {
    e.preventDefault();
    const form = e.target;
    
    const newFlight = {
        date: form.date.value,
        type: form.type.value,
        time: form.time.value,
        crew: Array.from(form.querySelectorAll('input[name="crew"]'))
            .map(input => input.value.trim())
            .filter(f => f),
        route: form.route.value,
        details: {
            comment: form.comment.value
        }
    };
    
    flights.push(newFlight);
    localStorage.setItem('flights', JSON.stringify(flights));
    renderFlights();
    form.reset();
    updateStatistics();
}

// Поиск по фамилии
function performSearch(query) {
    const results = flights.filter(flight => 
        flight.crew.some(member => 
            member.toLowerCase().includes(query.toLowerCase())
        )
    );
    renderSearchResults(results);
}

// Поиск по маршруту
function performRouteSearch(query) {
    const results = flights.filter(flight => 
        flight.route.toLowerCase().includes(query.toLowerCase())
    );
    renderSearchResults(results);
}

// Добавление члена экипажа
function addCrewMember() {
    const crewSection = document.querySelector('.crew-section');
    const newMember = document.createElement('div');
    newMember.classList.add('crew-member');
    newMember.innerHTML = `
        <input type="text" name="crew" placeholder="Фамилия члена экипажа">
        <button type="button" onclick="removeCrewMember(this)">×</button>
    `;
    crewSection.appendChild(newMember);
}

function removeCrewMember(button) {
    button.parentNode.remove();
}

// Отображение