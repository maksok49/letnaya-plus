function onTelegramAuth(user) {
  const name = user.first_name + (user.last_name ? ' ' + user.last_name : '');
  document.getElementById('app').innerText = 'Привет, ' + name + '!';
}

const script = document.createElement('script');
script.src = 'https://telegram.org/js/telegram-widget.js?7';
script.setAttribute('data-telegram-login', 'trueletnaya_bot'); // ← замени на имя своего бота
script.setAttribute('data-size', 'large');
script.setAttribute('data-userpic', 'false');
script.setAttribute('data-request-access', 'write');
script.setAttribute('data-onauth', 'onTelegramAuth(user)');
document.body.appendChild(script);
