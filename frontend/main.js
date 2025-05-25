const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем окно

// Отправка данных Telegram в backend
fetch("http://localhost:3000/auth", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(tg.initDataUnsafe.user)
})
  .then(res => res.json())
  .then(user => {
    document.getElementById("user-info").innerHTML = `
      Привет, ${user.name}!<br/>
      💰 Баланс: ${user.balance} фишек
    `;
  })
  .catch(err => {
    console.error("Auth error", err);
    alert("Ошибка авторизации");
  });

function navigate(to) {
  alert("Переход в раздел: " + to);
}

function navigate(section) {
  window.location.href = `${section}.html`;
}


