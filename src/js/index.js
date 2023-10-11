import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPhotos } from './api';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const perPage = 40;
let currentPage = 1;
let searchQuestion = '';

btnLoadMore.style.display = 'none';

const createImagesGallery = images => {
  const markup = images
    .map(
      image => `<div class="photo-card">
  <a class="photo-card__link" href="${image.largeImageURL}"><img class="photo-card__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${image.likes}
    </p>
    <p class="info-item">
      <b>Views:</b> ${image.views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b> ${image.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
  gallery.innerHTML += markup;
  console.log('Show gallery:', gallery);
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
};

const fetchImages = async () => {
  try {
    const response = await fetchPhotos(searchQuestion, currentPage, perPage);

    if (response.hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      btnLoadMore.style.display = 'none';
    } else {
      createImagesGallery(response.hits);
      const totalHits = response.totalHits;
      Notiflix.Notify.success(`Success! We found ${totalHits} images.`);

      if (currentPage === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }

      if (response.totalHits <= currentPage * perPage) {
        btnLoadMore.style.display = 'none';
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        btnLoadMore.style.display = 'block';
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const searchValue = event.currentTarget.elements.searchQuery.value;

  if (searchValue.trim() === '') {
    Notiflix.Notify.failure('Error. You must enter something.');
    searchQuestion = '';
    return;
  }

  searchQuestion = searchValue;
  gallery.innerHTML = '';
  currentPage = 1;
  fetchImages();
});

btnLoadMore.addEventListener('click', () => {
  console.log('Load More clicked!');
  currentPage++;
  fetchImages();

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
