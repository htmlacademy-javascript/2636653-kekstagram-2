import { isEscapeKey } from './util.js';
import { EFFECTS } from './const.js';
import { sendData } from './api.js';


// Вынесите функции показа сообщений на верхний уровень
const showSuccessMessage = () => {
  const template = document.querySelector('#success').content;
  const successElement = template.cloneNode(true);
  document.body.append(successElement);

  const successMessage = document.querySelector('.success');
  const successButton = successMessage.querySelector('.success__button');

  const closeSuccess = () => {
    successMessage.remove();
    document.removeEventListener('keydown', onEscKeydown);
    document.removeEventListener('click', onOutsideClick);
  };

  const onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      closeSuccess();
    }
  };

  const onOutsideClick = (evt) => {
    if (!evt.target.closest('.success__inner')) {
      closeSuccess();
    }
  };

  successButton.addEventListener('click', closeSuccess);
  document.addEventListener('keydown', onEscKeydown);
  document.addEventListener('click', onOutsideClick);
};

const showErrorMessage = () => {
  const template = document.querySelector('#error').content;
  const errorElement = template.cloneNode(true);
  document.body.append(errorElement);

  const errorMessage = document.querySelector('.error');
  const errorButton = errorMessage.querySelector('.error__button');

  const closeError = () => {
    errorMessage.remove();
    document.removeEventListener('keydown', onEscKeydown);
    document.removeEventListener('click', onOutsideClick);
  };

  const onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      closeError();
    }
  };

  const onOutsideClick = (evt) => {
    if (!evt.target.closest('.error__inner')) {
      closeError();
    }
  };

  errorButton.addEventListener('click', closeError);
  document.addEventListener('keydown', onEscKeydown);
  document.addEventListener('click', onOutsideClick);
};

const initUploadForm = () => {
  const imgUploadForm = document.querySelector('.img-upload__form');
  const imgUploadInput = document.querySelector('.img-upload__input');
  const imgUploadOverlay = document.querySelector('.img-upload__overlay');
  const imgUploadCancel = document.querySelector('.img-upload__cancel');
  const body = document.querySelector('body');
  const scaleControlSmaller = document.querySelector('.scale__control--smaller');
  const scaleControlBigger = document.querySelector('.scale__control--bigger');
  const scaleControlValue = document.querySelector('.scale__control--value');
  const sliderElement = document.querySelector('.effect-level__slider');
  const effectValue = document.querySelector('.effect-level__value');
  let currentEffect = 'none';
  const effectsList = document.querySelector('.effects__list');

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
    sliderElement.classList.add('hidden');
  }

  imgUploadInput.addEventListener('change', openUploadForm);

  // валидация формы
  const HASHTAG = /^#[a-zа-яё0-9]{1,19}$/i;
  const hashtagsField = imgUploadForm.querySelector('.text__hashtags');

  const pristine = new Pristine(imgUploadForm, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__field-wrapper--error',
  });


  const submitButton = imgUploadForm.querySelector('.img-upload__submit');

  imgUploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (!isValid) {
      return;
    }

    submitButton.disabled = true;

    const formData = new FormData(imgUploadForm);

    sendData(formData)
      .then(() => {
        closeUploadForm();
        showSuccessMessage();
      })
      .catch(() => {
        showErrorMessage();
      })
      .finally(() => {
        submitButton.disabled = false;
      });
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

  // масштаб картинки

  const imgUploadPreview = document.querySelector('.img-upload__preview img');
  scaleControlSmaller.onclick = function() {
    const currentValue = scaleControlValue.value;
    let numericValue = parseInt(currentValue);

    numericValue -= 25;
    if (numericValue < 25) {
      numericValue = 25;
    }
    scaleControlValue.value = `${numericValue}%`;
    imgUploadPreview.style.transform = `scale(${numericValue / 100})`;
  };

  scaleControlBigger.onclick = function() {
    const currentValue = scaleControlValue.value;
    let numericValue = parseInt(currentValue);

    numericValue += 25;
    if (numericValue > 100) {
      numericValue = 100;
    }
    scaleControlValue.value = `${numericValue}%`;
    imgUploadPreview.style.transform = `scale(${numericValue / 100})`;
  };

  // слайдер

  noUiSlider.create(sliderElement, {
    range: {
      min: 0,
      max: 100,
    },
    start: 1,
    step: 1,
    connect: 'lower',
  });

  sliderElement.noUiSlider.on('update', () => {
    const value = sliderElement.noUiSlider.get();
    effectValue.value = value;

    if (currentEffect !== 'none') {
      const effect = EFFECTS[currentEffect];
      imgUploadPreview.style.filter = `${effect.filter}(${value}${effect.unit})`;
    }
  });

  effectsList.addEventListener('change', (evt) => {
    currentEffect = evt.target.value;
    const effect = EFFECTS[currentEffect];

    if (currentEffect === 'none') {
      sliderElement.classList.add('hidden');
      imgUploadPreview.style.filter = 'none';
    } else {
      sliderElement.classList.remove('hidden');
      sliderElement.noUiSlider.updateOptions({
        range: {
          min: effect.min,
          max: effect.max
        },
        step: effect.step,
        start: effect.max
      });
    }
  });


  function closeUploadForm () {
    imgUploadOverlay.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onDocumentKeydown);


    // Сброс формы
    imgUploadForm.reset();
    pristine.reset();

    // Сброс масштаба
    scaleControlValue.value = '100%';
    imgUploadPreview.style.transform = 'scale(1)';

    // Сброс эффекта
    currentEffect = 'none';
    imgUploadPreview.style.filter = 'none';
    sliderElement.classList.add('hidden');

    // Сброс слайдера
    sliderElement.noUiSlider.updateOptions({
      range: { min: 0, max: 100 },
      start: 100,
      step: 1
    });

    imgUploadInput.value = '';
  }

  imgUploadCancel.addEventListener('click', closeUploadForm);
};

export { initUploadForm };
