// Навигация между страницами
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active-page');
    });
    document.getElementById(pageId).classList.add('active-page');
}

// Инициализация страниц
const pages = {
    flights: {
        init: () => {
            // Инициализация формы ввода полётов
            document.getElementById('flight-form').addEventListener('submit', handleFlightSubmit);
            renderFlights();
        }
    },
    
    stats: {
        init: () => {
            // Инициализация поиска и фильтров
            document.getElementById('search-button').addEventListener('click', performSearch);
            document.getElementById('crew-filter-button').addEventListener('click', applyCrewFilter);
            updateStatistics();
        }
    },
    
    charts: {
        init: () => {
            // Инициализация графиков
            initCharts();
            document.getElementById('history-form').addEventListener('submit', handleHistorySubmit);
        }
    }
};

// Загрузка данных при старте
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    pages.flights.init();
});

// Сохранение данных
function saveData() {
    localStorage.setItem('flights', JSON.stringify(appData.flights));
    localStorage.setItem('history', JSON.stringify(appData.history));
}

// Загрузка данных
function loadData() {
    appData.flights = JSON.parse(localStorage.getItem('flights')) || [];
    appData.history = JSON.parse(localStorage.getItem('history')) || {};
}
