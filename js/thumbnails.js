import { openBigPhoto } from './full-photo.js';

const template = document.querySelector('#picture').content.querySelector('.picture');
const container = document.querySelector('.pictures');

const createThumbnails = (photo) => {
  const thumbnails = template.cloneNode(true);
  const image = thumbnails.querySelector('.picture__img');

  image.src = photo.url;
  image.alt = photo.description;
  thumbnails.querySelector('.picture__comments').textContent = photo.comments.length;
  thumbnails.querySelector('.picture__likes').textContent = photo.likes;

  thumbnails.addEventListener('click', (evt) => {
    evt.preventDefault();
    openBigPhoto(photo);
  });

  return thumbnails;
};

const clearThumbnails = () => {
  const pictures = document.querySelectorAll('.picture');
  pictures.forEach((picture) => picture.remove());
};

const renderThumbnails = (photos, isReplace = false) => {
  if (isReplace) {
    clearThumbnails();
  }

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    fragment.appendChild(createThumbnails(photo));
  });

  container.appendChild(fragment);
};

export { renderThumbnails };
