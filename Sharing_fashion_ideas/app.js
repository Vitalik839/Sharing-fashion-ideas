const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Шлях до файлу для зберігання користувачів
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware для парсингу form data
app.use(bodyParser.urlencoded({ extended: true }));

// Для статичних файлів (CSS, зображення тощо)
app.use(express.static(path.join(__dirname, 'public')));

// Завантаження користувачів
const loadUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
};

// Збереження користувачів
const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Роут для головної сторінки (вхід)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Роут для сторінки реєстрації
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Обробка реєстрації
app.post('/signup', (req, res) => {
    const { email, username, psw } = req.body;

    const users = loadUsers();

    if (users[username]) {
        return res.status(400).send('Користувач із таким ім\'ям уже існує!');
    }

    users[username] = { email, password: psw };
    saveUsers(users);

    res.redirect('/');
});

// Обробка входу
app.post('/signin', (req, res) => {
    const { username, psw } = req.body;

    const users = loadUsers();

    if (users[username] && users[username].password === psw) {
        return res.send(`Ласкаво просимо, ${username}!`);
    } else {
        return res.status(401).send('Неправильне ім\'я або пароль!');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
