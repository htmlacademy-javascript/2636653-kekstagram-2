import { EFFECTS } from './const.js';
import { sendData } from './api.js';

const HASHTAG = /^#[a-zа-яё0-9]{1,19}$/i;
const QUANTITY_HASHTAGS = 5;
const QUANTITY_SIMBOLS = 140;
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const isEscapeKey = (evt) => evt.key === 'Escape';
const template = document.querySelector('#success').content;

const showSuccessMessage = () => {
  const successElement = template.cloneNode(true);
  document.body.append(successElement);

  const successMessage = document.querySelector('.success');
  const successButton = successMessage.querySelector('.success__button');

  function onEscKeydown(evt) {
    if (evt.key === 'Escape') {
      closeSuccess();
    }
  }

  function onOutsideClick(evt) {
    if (!evt.target.closest('.success__inner')) {
      closeSuccess();
    }
  }

  function closeSuccess() {
    successMessage.remove();
    document.removeEventListener('keydown', onEscKeydown);
    document.removeEventListener('click', onOutsideClick);
  }

  successButton.addEventListener('click', closeSuccess);
  document.addEventListener('keydown', onEscKeydown);
  document.addEventListener('click', onOutsideClick);
};
const errorTemplate = document.querySelector('#error').content;

const showErrorMessage = () => {
  const errorElement = errorTemplate.cloneNode(true);
  document.body.append(errorElement);

  const errorMessage = document.querySelector('.error');
  const errorButton = errorMessage.querySelector('.error__button');

  function onEscKeydown(evt) {
    if (evt.key === 'Escape') {
      closeError();
    }
  }

  function onOutsideClick(evt) {
    if (!evt.target.closest('.error__inner')) {
      closeError();
    }
  }

  function closeError() {
    errorMessage.remove();
    document.removeEventListener('keydown', onEscKeydown);
    document.removeEventListener('click', onOutsideClick);
  }

  errorButton.addEventListener('click', closeError);
  document.addEventListener('keydown', onEscKeydown);
  document.addEventListener('click', onOutsideClick);
};

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
const imgUploadPreview = document.querySelector('.img-upload__preview img');
const effectsPreview = document.querySelectorAll('.effects__preview');
const hashtagsField = imgUploadForm.querySelector('.text__hashtags');
const submitButton = imgUploadForm.querySelector('.img-upload__submit');
const commentField = imgUploadForm.querySelector('.text__description');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');

const initUploadForm = () => {
  const onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      if (document.querySelector('.error') || document.querySelector('.success')) {
        return;
      }
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

  // Функция загрузки изображения
  const onFileInputChange = (evt) => {
    const file = evt.target.files[0];
    if (file) {
      const currentImageUrl = URL.createObjectURL(file);
      imgUploadPreview.src = currentImageUrl;

      // Обновляем превью для всех эффектов
      effectsPreview.forEach((preview) => {
        preview.style.backgroundImage = `url('${currentImageUrl}')`;
      });
    }
    openUploadForm();
  };

  function openUploadForm() {
    imgUploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
    sliderElement.classList.add('hidden');
    effectLevelContainer.style.display = 'none';
  }

  imgUploadInput.addEventListener('change', onFileInputChange);

  // валидация формы

  const pristine = new Pristine(imgUploadForm, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__field-wrapper--error',
  });

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
    return hashtags.length <= QUANTITY_HASHTAGS;
  };

  pristine.addValidator(
    hashtagsField,
    validateHashtagsCount,
    `Нельзя указать больше ${QUANTITY_HASHTAGS} хэштегов`
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

  const validateComment = (value) => value.length <= QUANTITY_SIMBOLS;

  pristine.addValidator(
    commentField,
    validateComment,
    `Длина комментария больше ${QUANTITY_SIMBOLS} символов`
  );

  // масштаб картинки
  scaleControlSmaller.onclick = function() {
    const currentValue = scaleControlValue.value;
    let numericValue = parseInt(currentValue, 10);

    numericValue -= SCALE_STEP;
    if (numericValue < SCALE_MIN) {
      numericValue = SCALE_MIN;
    }
    scaleControlValue.value = `${numericValue}%`;
    imgUploadPreview.style.transform = `scale(${numericValue / SCALE_MAX})`;
  };

  scaleControlBigger.onclick = function() {
    const currentValue = scaleControlValue.value;
    let numericValue = parseInt(currentValue, 10);

    numericValue += SCALE_STEP;
    if (numericValue > SCALE_MAX) {
      numericValue = SCALE_MAX;
    }
    scaleControlValue.value = `${numericValue}%`;
    imgUploadPreview.style.transform = `scale(${numericValue / SCALE_MAX})`;
  };

  // слайдер
  noUiSlider.create(sliderElement, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
  });

  sliderElement.noUiSlider.on('update', () => {
    const value = sliderElement.noUiSlider.get();
    const roundedValue = Math.round(value * 10) / 10;
    effectValue.value = roundedValue;

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
      effectLevelContainer.style.display = 'none';
      imgUploadPreview.style.filter = 'none';
    } else {
      effectLevelContainer.style.display = '';
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

  function closeUploadForm() {
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

    // Сброс изображения на стандартное
    imgUploadPreview.src = 'img/upload-default-image.jpg';

    // Сброс превью эффектов
    effectsPreview.forEach((preview) => {
      preview.style.backgroundImage = '';
    });

    imgUploadInput.value = '';
  }

  imgUploadCancel.addEventListener('click', closeUploadForm);
};

export { initUploadForm, isEscapeKey };
