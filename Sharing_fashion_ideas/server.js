const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// Обробник маршруту для реєстрації
app.post('/signup', (req, res) => {
  const userData = req.body;

  // Шлях до файлу JSON
  const filePath = path.join(__dirname, 'users.json');

  // Зчитування існуючих даних
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Error reading file:', err);
      return res.status(500).send('Server error');
    }

    let users = [];
    if (data) {
      users = JSON.parse(data);
    }

    // Додавання нового користувача
    users.push(userData);

    // Запис у файл
    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).send('Server error');
      }

      res.status(200).send('User registered successfully!');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
