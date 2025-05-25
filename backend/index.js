const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// Простая имитация базы данных
const users = {}; // userId => userData

app.use(cors());
app.use(express.json());

// Проверка авторизации Telegram
function isValidTelegramAuth(data) {
  // Тут должна быть проверка hash по bot_token
  return !!data?.id && !!data?.first_name;
}

// Хранилище комнат
const rooms = {};

function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];
  for (let s of suits)
    for (let r of ranks)
      deck.push(r + s);
  return deck.sort(() => Math.random() - 0.5);
}

app.post("/game/join", (req, res) => {
  const { user, seats } = req.body;
  if (!user?.id || !seats) return res.status(400).json({ error: "Invalid data" });

  // Поиск подходящей комнаты
  let room = Object.values(rooms).find(r => r.seats === seats && r.players.length < seats);

  // Если нет — создаём
  if (!room) {
    const roomId = Math.random().toString(36).substring(2, 8);
    room = { roomId, seats, players: [], deck: createDeck() };
    rooms[roomId] = room;
  }

  // Проверка на дублирование
  if (room.players.some(p => p.id === user.id)) {
    return res.json({ roomId: room.roomId, players: room.players });
  }

  // Добавление игрока
  const player = {
    id: user.id,
    name: user.first_name,
    stack: 1000,
    cards: room.deck.splice(0, 2)
  };
  room.players.push(player);

  res.json({ roomId: room.roomId, players: room.players });
});


app.post("/auth", (req, res) => {
  const tgUser = req.body;

  if (!isValidTelegramAuth(tgUser)) {
    return res.status(401).json({ error: "Invalid auth" });
  }

  // Добавление в "базу"
  if (!users[tgUser.id]) {
    users[tgUser.id] = {
      id: tgUser.id,
      name: tgUser.first_name,
      balance: 1000,
      nfts: [],
      stats: { wins: 0, losses: 0 },
    };
  }

  res.json(users[tgUser.id]);
});

app.get("/user/:id", (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

app.listen(PORT, () => console.log(`✅ Backend запущен на http://localhost:${PORT}`));
