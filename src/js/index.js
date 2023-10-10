import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPhotos } from './api';

const apiKey = '39706088-eed53521a6a27e1b88370a6d4';

const searchForm = document.getElementById('search-form');
console.log(searchForm);
const gallery = document.querySelector('.gallery');
console.log(gallery);
const loadMoreBtn = document.querySelector('.load-more');
console.log(loadMoreBtn);

const perPage = 40;
let page = 1;
let searchQuery = '';

loadMoreBtn.style.display = 'none';

const handleSearch = async () => {
  const searchValue = searchForm.searchQuery.value.trim();

  if (searchValue === '') {
    Notiflix.Notify.failure('Error. You must enter something.');
    searchQuery = '';
    return;
  }

  searchQuery = searchValue;
  gallery.innerHTML = '';
  page = 1;

  try {
    const data = await fetchPhotos(searchQuery, page, perPage);

    if (data.hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      loadMoreBtn.style.display = 'none';
    } else {
      galleryElements(data.hits);
      const totalHits = data.totalHits;
      Notiflix.Notify.success(`Success! We found ${totalHits} images.`);

      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }

      if (data.totalHits <= page * perPage) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        loadMoreBtn.style.display = 'block';
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const galleryElements = images => {
  const galleryHTML = images
    .map(image => {
      return `
        <div class="photo-card">
          <a class="photo-card__link" href="${image.largeImageURL}">
            <img class="photo-card__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </div>
      `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', galleryHTML);
  const lightbox = new SimpleLightbox('.photo-card a');
  lightbox.refresh();
};

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  handleSearch();
});

loadMoreBtn.addEventListener('click', () => {
  console.log('Load More clicked!');
  page++;
  handleSearch();

  const galleryElement = document.querySelector('.gallery');

  if (galleryElement.firstElementChild) {
    const { height: cardHeight } =
      galleryElement.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
});
