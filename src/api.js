import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36750310-152ad14142666def8d55f95da';

let page = 1;
const perPage = 40;
// let searchQuery = '';

// отримуємо посилання
// вішаємо слухач подій на сабміт на форму
// отримуємо запит з імпуту і передаємо у вигляді квері параметру на сервер
// перевірити відповідь серверу
// якщо негативна відповідь - інформувати слухача
// отримуємо результат та перебираємо масив новин та ств з нього розмітку
// показуємо користувачу розмітку(іннер штмл)
// ощичуємо форму

export async function getNews(searchQuery, page = 1) {
  const { data } = await axios.get(
    `${URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );

  return data;
}
