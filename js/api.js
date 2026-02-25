import { renderThumbnails } from './thumbnails.js';


fetch('https://31.javascript.htmlacademy.pro/kekstagram/data')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Не удалось загрузить данные');
    }
    return response.json();
  })
  .then((photos) => {
    renderThumbnails(photos);
  })
  .catch(() => {
    const dataErrorTemplate = document.querySelector('#data-error').content;
    const errorElement = dataErrorTemplate.cloneNode(true);
    document.body.appendChild(errorElement);

    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  });


const sendData = (formData) => fetch('https://31.javascript.htmlacademy.pro/kekstagram/data', {
  method: 'POST',
  body: formData,
})
  .then((response) => {
    if (!response.ok) {
      throw new Error('Не удалось отправить данные');
    }
    return response.json();
  });

export { sendData };
