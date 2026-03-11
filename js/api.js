const BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram/data/';
const POST_URL = 'https://31.javascript.htmlacademy.pro/kekstagram/';
const getData = () =>
  fetch(BASE_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные');
      }
      return response.json();
    });


const sendData = (formData) => fetch(POST_URL, {
  method: 'POST',
  body: formData,
})
  .then((response) => {
    if (!response.ok) {
      throw new Error('Не удалось отправить данные');
    }
    return response.json();
  });

export { getData, sendData };
