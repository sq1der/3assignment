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

// Обсуждаемые темы (3 апи)
router.get('/topic', async (req, res) => {
  try {
    //StackOverflow API
    const stackResponse = await axios.get('https://api.stackexchange.com/2.3/questions', {
      params: {
        order: 'desc',
        sort: 'votes',
        site: 'stackoverflow',
        filter: '!9_bDE(fI5',
        pagesize: 6
      }
    });
    const stackQuestions = stackResponse.data.items.map(question => ({
      title: question.title,
      url: question.link,
      author: question.owner.display_name,
      score: question.score,
      answers: question.answer_count,
    }));

    //dev.to API
    const devResponse = await axios.get('https://dev.to/api/articles?per_page=6');
    const devArticles = devResponse.data.map(article => ({
      title: article.title,
      url: article.url,
      image: article.social_image || '/default-news.jpg',
      author: article.user.name,
      date: new Date(article.published_at).toLocaleDateString(),
      description: article.description || 'Описание отсутствует.'
    }));

    //GitHub API
    const githubResponse = await axios.get('https://api.github.com/search/repositories', {
      params: {
        q: 'stars:>10000',
        sort: 'stars',
        order: 'desc',
        per_page: 6
      }
    });
    const githubRepos = githubResponse.data.items.map(repo => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description || 'Описание отсутствует.',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || 'Не указан',
      owner: repo.owner.login
    }));

    res.render('topic', { stackQuestions, devArticles, githubRepos, error: null });
  } catch (error) {
    console.error('Ошибка получения данных:', error.message);
    res.render('topic', { stackQuestions: [], devArticles: [], githubRepos: [], error: 'Не удалось загрузить данные.' });
  }
});


module.exports = router;