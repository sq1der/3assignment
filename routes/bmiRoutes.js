const express = require('express');
const router = express.Router();

// мейн страница 
router.get('/', (req, res) => {
  res.render('index');  // отображает главную страницу
});

// маршрут для стр калькулятора ИМТ
router.get('/bmi', (req, res) => {
  res.render('bmi', { bmi: null, message: '' });  // передаем пустые значения по умолчанию
});

// маршрут для расчёта ИМТ
router.post('/bmi', (req, res) => {
  const { height, weight, age, gender } = req.body;

  // рост в метры
  const heightInMeters = height / 100;
  // вычисляем ИМТ
  const bmi = weight / (heightInMeters ** 2);

  // определяем сообщ
  let message = '';
  if (bmi < 18.5) {
    message = 'Недостаток веса';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    message = 'Нормальный вес';
  } else if (bmi >= 25 && bmi < 29.9) {
    message = 'Избыточный вес';
  } else {
    message = 'Ожирение';
  }

  // отправляем резы обратно в шаблон
  res.render('bmi', { bmi: bmi.toFixed(2), message });
});

module.exports = router;
