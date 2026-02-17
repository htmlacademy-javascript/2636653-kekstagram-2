import { isEscapeKey } from './util.js';
import { EFFECTS } from './const.js';

const initUploadForm = () => {
  const imgUploadForm = document.querySelector('.img-upload__form');
  const imgUploadInput = document.querySelector('.img-upload__input');
  const imgUploadOverlay = document.querySelector('.img-upload__overlay');
  const imgUploadCancel = document.querySelector('.img-upload__cancel');
  const body = document.querySelector('body');
  const scaleControlSmaller = document.querySelector('.scale__control--smaller');
  const scaleControlBigger = document.querySelector('.scale__control--bigger');
  const scaleControlValue = document.querySelector('.scale__control--value');


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

  imgUploadForm.addEventListener('submit', () => {
    const isValid = pristine.validate();
    if (isValid) {
      console.log('Можно отправлять');
    } else {
      console.log('Форма невалидна');
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

  const sliderElement = document.querySelector('.img-upload__effect-level');
  const effectValue = document.querySelector('.effect-level__value');
  let currentEffect = 'none';
  const effectsList = document.querySelector('.effects__list');

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
    imgUploadInput.value = '';
    imgUploadForm.reset();
    pristine.reset();
  }

  imgUploadCancel.addEventListener('click', closeUploadForm);
};

export { initUploadForm };
