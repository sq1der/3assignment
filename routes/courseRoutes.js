const express = require('express');
const router = express.Router();
const axios = require('axios');

// Страница с курсами
router.get('/courses', async (req, res) => {
  const searchQuery = req.query.search || 'чистый код'; // Стандартный поиск, курсы программирования как никак
  let books = [];

  // Гугл книги апи
  try {
      const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
              q: searchQuery,
              maxResults: 6  // Количество книг
          }
      });

      if (response.data.items) {
          books = response.data.items.map(item => ({
              title: item.volumeInfo.title,
              authors: item.volumeInfo.authors || ['Неизвестно'],
              description: item.volumeInfo.description || 'Отсуствует описание',
              thumbnail: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : '',
              link: item.volumeInfo.infoLink
          }));
      }

      res.render('courses', { books, searchQuery });
  } catch (error) {
      console.error('Ошибка получения:', error);
      res.status(500).send('Не удалось получить книги');
  }
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
    let city = req.query.city;

    if (!city) {
      const geoResponse = await axios.get(
        `https://ipgeolocation.abstractapi.com/v1/?api_key=${geoAPIKey}`
      );
      city = geoResponse.data.city;
    }

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
  } catch (error) {
    console.error('Ошибка:', error.message);
    res.render('weather', { error: 'Не удалось получить данные о погоде. Попробуйте позже.' });
  }
});


// Компилятор
router.get('/compiler', (req, res) => {
  res.render('compiler');
});

router.post('/compiler', async (req, res) => {
  const { code, language, input } = req.body;
  try {
      const response = await axios.post('https://api.jdoodle.com/v1/execute', {
          script: code,
          language: language,
          stdin: input,
          versionIndex: '0',
          clientId: '4b7bfb6f34af864eab6ac1a8a0944aea',
          clientSecret: 'c61cb9e4ce7da2faef56de645bde6e47d1e257e7ffedc1c36aff1c6a465453a7',
      });
      res.render('compiler', { output: response.data.output });
  } catch (error) {
      console.error('Error running code:', error);
      res.status(500).send('Failed to execute code');
  }
});



module.exports = router;