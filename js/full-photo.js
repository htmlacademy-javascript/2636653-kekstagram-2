import { isEscapeKey } from './util.js';

const bigPicture = document.querySelector('.big-picture');
const socialCcommentCount = document.querySelector('.social__comment-count');
const commentsLoader = document.querySelector('.comments-loader');
const body = document.querySelector('body');
const buttonClose = bigPicture.querySelector('.cancel');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = document.querySelector('.likes-count');
const socialComment = document.querySelector('.social__comment-shown-count');
const socialCommentCount = document.querySelector('.social__comment-total-count');
const socialCaption = bigPicture.querySelector('.social__caption');
const socialCommentsContainer = bigPicture.querySelector('.social__comments');


const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPhoto();
  }
};

function openBigPhoto(photo) {
  bigPicture.classList.remove('hidden');
  socialCcommentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');
  body.classList.add('modal-open');

  bigPictureImg.src = photo.url;
  likesCount.textContent = photo.likes;
  socialComment.textContent = photo.comments.length;
  socialCommentCount.textContent = photo.comments.length;
  socialCaption.textContent = photo.description;

  // socialCommentsContainer.innerHTML = '';

  document.addEventListener('keydown', onDocumentKeydown);
}


function closeBigPhoto () {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);
}


buttonClose.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeBigPhoto();
});


export {openBigPhoto, closeBigPhoto};
