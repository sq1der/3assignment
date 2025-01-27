const express = require('express');
const router = express.Router();
const axios = require('axios');

// Страница с курсами
router.get('/courses', (req, res) => {
  res.render('courses');
});

// Страница "О нас"
router.get('/about', async (req, res) => {
  try {
    const response = await axios.get('https://programming-quotes-api.azurewebsites.net/api/quotes/random');
    const quote = response.data;

    res.render('about', { quote });
  } catch (error) {
    console.error('Ошибка получения цитаты:', error.message);
    res.render('about', { quote: { en: 'Программирование — это искусство.', author: 'Неизвестный автор' } });
  }
});

// Страница "Контакты"
router.get('/contact', (req, res) => {
  res.render('contact');
});

// Страница погоды
router.get('/weather', async (req, res) => {
  const geoAPIKey = '1363562df9eb498eac3bf13ed8a8583b';
  const weatherAPIKey = '9f9a8e09c5df05dbe4274f7a133ce4a0';

  try {
    // Геолокация
    const geoResponse = await axios.get(
      `https://ipgeolocation.abstractapi.com/v1/?api_key=${geoAPIKey}`
    );

    const { city, latitude: lat, longitude: lon } = geoResponse.data;

    // Погода
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${weatherAPIKey}&units=metric&lang=ru`
    );

    const weatherData = weatherResponse.data;

    const weatherInfo = {
      city: weatherData.name,
      temperature: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      description:
        weatherData.weather[0].description.charAt(0).toUpperCase() +
        weatherData.weather[0].description.slice(1),
      icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
      coordinates: `Широта: ${weatherData.coord.lat}, Долгота: ${weatherData.coord.lon}`,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      wind_speed: weatherData.wind.speed,
      country: weatherData.sys.country,
      rain: weatherData.rain ? weatherData.rain['1h'] || 0 : 0,
    };

    res.render('weather', { weather: weatherInfo });
    console.log(lat, lon);
  } catch (error) {
    console.error('Ошибка:', error.message);
    res.render('weather', { error: 'Не удалось получить данные о погоде. Попробуйте позже.' });
  }
});


module.exports = router;