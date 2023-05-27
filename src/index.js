import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getNews } from './api';

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('input');
const buttonEl = document.querySelector('button');
const divEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
let page = 1;
const perPage = 40;
let searchValue = '';

loadMoreBtnEl.style.display = 'none';

formEl.addEventListener('submit', onSubmitClick);

async function onSubmitClick(event) {
  event.preventDefault();

  const value = event.currentTarget.elements.searchQuery.value.trim();

  if (!value) {
    clearHitsList();
    loadMoreBtnEl.style.display = 'none';
    Notify.info('No value!');
    return;
  } else {
    searchValue = value;
    page = 1;
    const { hits, totalHits } = await getNews(value);

    console.log(hits, totalHits);

    if (hits.length === 0) {
      clearHitsList();
      loadMoreBtnEl.style.display = 'none';
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      formEl.reset();

      return;
    }

    clearHitsList();
    Notify.success(`'Hooray! We found ${totalHits} images.'`);
    getHitsMarkup(hits);
    loadMoreBtnEl.style.display = 'block';
  }
}
function getHitsMarkup(hits) {
  const markupList = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card"><a class="photo_link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width=320px height=250px /></a>
  <div class="info">
    <p class="info-item">likes<span class="info-span">${likes}</span></p>
    <p class="info-item">views<span class="info-span">${views}</span></p>
    <p class="info-item">comments<span class="info-span">${comments}</span></p>
    <p class="info-item">downloads<span class="info-span">${downloads}</span></p>
</div>
</div>`
    )
    .join('');
  divEl.insertAdjacentHTML('beforeend', markupList);
  const lightbox = new SimpleLightbox('.photo_link');
  lightbox.refresh();
  //   divEl.innerHTML = markupList;
}

function clearHitsList() {
  divEl.innerHTML = '';
}

loadMoreBtnEl.addEventListener('click', onLoadMoreClick);

async function onLoadMoreClick() {
  page += 1;
  const { hits, totalHits } = await getNews(searchValue, page);

  getHitsMarkup(hits);

  if (totalHits < perPage || hits.length === 0) {
    loadMoreBtnEl.style.display = 'none';
    Notify.info(
      'We are sorry, but you have reached the end of search results.'
    );
    return;
  }
}
