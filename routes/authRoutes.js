const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Регистрация' });
});

router.post('/signup', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.send('Пароли не совпадают.');
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.send('Пользователь с таким email уже существует.');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Вход' });
});

router.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.send('Неверные данные для входа.');
  }
  req.session.loggedIn = true;
  req.session.userId = user._id;
  req.session.isAdmin = user.isAdmin;
  res.redirect('/');
});


router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Ошибка выхода из системы');
    }
    res.redirect('/login');
  });
});

module.exports = router;
