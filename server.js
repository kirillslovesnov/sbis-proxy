const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

// Авторизация в СБИС
async function getSid() {
  const LOGIN = process.env.LOGIN;
  const PASSWORD = process.env.PASSWORD;

  console.log("🔐 LOGIN:", LOGIN);
  console.log("🔐 PASSWORD:", PASSWORD);

  try {
    const response = await axios.post(
      'https://online.sbis.ru/auth/service/',
      {
        jsonrpc: '2.0',
        protocol: 4,
        method: 'СБИС.Аутентификация.Анонимно',
        params: {
          login: LOGIN,
          password: PASSWORD,
        },
        id: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const sid = response.data?.result?.sid;
    if (!sid) {
      console.error('❌ Ошибка авторизации: ❌ SID не найден');
      return null;
    }

    console.log('✅ SID получен');
    return sid;
  } catch (error) {
    console.error('❌ Ошибка при запросе:', error.message);
    return null;
  }
}

app.post('/get-tender', async (req, res) => {
  const { tenderId } = req.body;

  if (!tenderId) {
    return res.status(400).json({ error: 'Не указан tenderId' });
  }

  const sid = await getSid();
  if (!sid) {
    return res.status(500).json({ error: 'Ошибка авторизации в SBIS' });
  }

  try {
    const response = await axios.post(
      'https://online.sbis.ru/webapi/',
      {
        jsonrpc: '2.0',
        protocol: 4,
        method: 'Поставщик.Получить',
        params: {
          ИД: tenderId,
        },
        id: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: `SID=${sid}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('❌ Ошибка при получении закупки:', error.message);
    res.status(500).json({ error: 'Ошибка при получении данных о закупке' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
