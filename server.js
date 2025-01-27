const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const courseRoutes = require('./routes/courseRoutes');
const bmiRoutes = require('./routes/bmiRoutes');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();



const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// устанавливаем EJS как движок шаблонов
app.set('view engine', 'ejs');

// указываем папку с шаблонами
app.set('views', path.join(__dirname, 'views'));

// подключаем папку public для css файлов
app.use(express.static('public'));

// подключаем маршруты
app.use('/', courseRoutes);
app.use('/', bmiRoutes);


const dbURI = 'mongodb+srv://aman:0909@cluster0.asuht.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI, {
    dbName: 'usersDB', // Укажите имя вашей базы данных
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(session({
  secret: '0909', // Секрет для сессий
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: dbURI, // Строка подключения к MongoDB
    collectionName: 'sessions', // Название коллекции для хранения сессий
  }),
}));



const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', authRoutes);
app.use('/', adminRoutes);

// мейн стр
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', loggedIn: req.session.loggedIn || false });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login', loggedIn: req.session.loggedIn });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login', loggedIn: req.session.loggedIn || false });
});


// Обработка формы логина
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Простая проверка логина и пароля
  if (username === 'user' && password === 'password') {
    req.session.loggedIn = true;
    req.session.username = username;
    res.redirect('/profile');
  } else {
    res.send('Invalid credentials');
  }
});

// Маршрут для страницы профиля
app.get('/profile', (req, res) => {
  if (req.session.loggedIn) {
    res.render('profile', { title: 'Profile', loggedIn: req.session.loggedIn, username: req.session.username });
  } else {
    res.redirect('/login');
  }
});

// Маршрут для страницы регистрации
app.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up', loggedIn: req.session.loggedIn });
});

// Обработка формы регистрации
app.post('/signup', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.send('Passwords do not match.');
  }
  console.log('New user:', { username, email, password });
  res.redirect('/login');
});

// Маршрут для выхода
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/profile');
    }
    res.redirect('/login');
  });
});

// запуск сервера на порту 3000
app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
