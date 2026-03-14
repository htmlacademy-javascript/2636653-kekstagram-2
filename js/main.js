
import { getData } from './api.js';
import { renderThumbnails } from './thumbnails.js';
import { initUploadForm } from './form.js';
import { initFilters } from './filters.js';

const ERROR_TIMEOUT = 5000;

initUploadForm();

getData()
  .then((photos) => {
    renderThumbnails(photos);
    initFilters(photos);

    const imgFilters = document.querySelector('.img-filters');
    imgFilters.classList.remove('img-filters--inactive');
  })

  .catch(() => {
    const dataErrorTemplate = document.querySelector('#data-error').content;
    const errorElement = dataErrorTemplate.cloneNode(true).firstElementChild;
    document.body.appendChild(errorElement);

    setTimeout(() => {
      errorElement.remove();
    }, ERROR_TIMEOUT);
  });
