const tg = window.Telegram.WebApp;
let user = tg.initDataUnsafe.user;

async function joinGame(seats) {
  const res = await fetch(`http://localhost:3000/game/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, seats })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  document.getElementById("table").classList.remove("hidden");

  const playersDiv = document.getElementById("players");
  playersDiv.innerHTML = data.players.map(p =>
    `<div class="bg-gray-800 p-2 rounded text-center">
      ${p.name}<br/>💰 ${p.stack}<br/>🃏 ${p.cards.join(" ")}
    </div>`
  ).join("");

  document.getElementById("status").innerText = `Вы в комнате: ${data.roomId}`;
}
