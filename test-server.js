const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Сервер работает!');
});

app.post('/test', (req, res) => {
  console.log('📥 Получен POST /test с телом:', req.body);
  res.json({ message: 'Привет от сервера!' });
});

console.log('🔧 Готовимся запустить сервер...');
app.listen(5000, () => {
  console.log('🚀 Сервер запущен на http://localhost:5000');
});
app.listen(5000, () => {
  console.log('🚀 Тестовый сервер запущен на http://localhost:5000');
});
