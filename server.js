const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profile');

const User = require('./models/User');
const Item = require('./models/Item');

const app = express();
const port = 3000;
const dbURI = 'mongodb+srv://aman:0909@cluster0.asuht.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0';

// Подключение к MongoDB
mongoose.connect(dbURI, { dbName: 'usersDB' })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Настройка middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Настройка движка шаблонов
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Настройка сессий
app.use(session({
  secret: '0909',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: dbURI, collectionName: 'sessions' })
}));

// Подключение маршрутов
app.use('/', courseRoutes);
app.use('/', authRoutes);
app.use('/', adminRoutes);
app.use('/profile', profileRoutes);

// Главная страница
app.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.render('index', { items });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка загрузки элементов');
  }
});

// Страница логина
app.get('/login', (req, res) => {
  res.render('login', { title: 'Login', loggedIn: req.session.loggedIn || false });
});

// Страница регистрации
app.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up', loggedIn: req.session.loggedIn });
});

// Страница профиля
app.get('/profile', async (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/login');

  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.send('Пользователь не найден.');

    res.render('profile', {
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка сервера.');
  }
});

// Выход из системы
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.redirect('/profile');
    res.redirect('/login');
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
