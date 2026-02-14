import { isEscapeKey } from './util.js';

const initUploadForm = () => {
  const imgUploadForm = document.querySelector('.img-upload__form');
  const imgUploadInput = document.querySelector('.img-upload__input');
  const imgUploadOverlay = document.querySelector('.img-upload__overlay');
  const imgUploadCancel = document.querySelector('.img-upload__cancel');
  const body = document.querySelector('body');


  const onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      const activeElement = document.activeElement;
      if (
        activeElement.classList.contains('text__hashtags') ||
      activeElement.classList.contains('text__description')
      ) {
        return;
      }
      evt.preventDefault();
      closeUploadForm();
    }
  };

  function openUploadForm () {
    imgUploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
  }

  imgUploadInput.addEventListener('change', openUploadForm);

  // валидация формы начало
  const HASHTAG = /^#[a-zа-яё0-9]{1,19}$/i;
  const hashtagsField = imgUploadForm.querySelector('.text__hashtags');

  const pristine = new Pristine(imgUploadForm, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__field-wrapper--error',
  });

  const submitButton = imgUploadForm.querySelector('.img-upload__submit');

  const blockSubmitButton = () => {
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
  };

  const unblockSubmitButton = () => {
    submitButton.disabled = false;
    submitButton.textContent = 'Опубликовать';
  };

  imgUploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (isValid) {
      console.log('Можно отправлять');
      blockSubmitButton();
    } else {
      console.log('Форма невалидна');
      unblockSubmitButton();
    }
  });

  const validateHashtagsCount = (value) => {
    if (!value.trim()) {
      return true;
    }

    const hashtags = value.trim().split(/\s+/);
    return hashtags.length <= 5;
  };

  pristine.addValidator(
    hashtagsField,
    validateHashtagsCount,
    'Нельзя указать больше пяти хэштегов'
  );

  const validateHashtagsUnique = (value) => {
    if (!value.trim()) {
      return true;
    }

    const hashtags = value.trim().split(/\s+/);
    const lowerHashtags = hashtags.map((tag) => tag.toLowerCase());

    return new Set(lowerHashtags).size === lowerHashtags.length;
  };

  pristine.addValidator(
    hashtagsField,
    validateHashtagsUnique,
    'Хэштеги не должны повторяться'
  );

  const validateHashtagsFormat = (value) => {
    if (!value.trim()) {
      return true;
    }

    const hashtags = value.trim().split(/\s+/);

    return hashtags.every((tag) => HASHTAG.test(tag));

  };
  pristine.addValidator(
    hashtagsField,
    validateHashtagsFormat,
    'Введён невалидный хэштег'
  );

  const commentField = imgUploadForm.querySelector('.text__description');
  const validateComment = (value) => value.length <= 140;

  pristine.addValidator(
    commentField,
    validateComment,
    'Длина комментария больше 140 символов');


  // валидация формы конец

  function closeUploadForm () {
    imgUploadOverlay.classList.add('hidden');
    body.classList.remove('modal-open');

    document.removeEventListener('keydown', onDocumentKeydown);
    imgUploadInput.value = '';
    imgUploadForm.reset();
  }

  imgUploadCancel.addEventListener('click', closeUploadForm);
};

export { initUploadForm };
