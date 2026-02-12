import { isEscapeKey } from './util.js';

const bigPicture = document.querySelector('.big-picture');
const socialCcommentCount = document.querySelector('.social__comment-count');
const commentsLoader = document.querySelector('.comments-loader');
const body = document.querySelector('body');
const buttonClose = bigPicture.querySelector('.cancel');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = document.querySelector('.likes-count');
const socialCommentShownCount = document.querySelector('.social__comment-shown-count');
const socialCommentTotalCount = document.querySelector('.social__comment-total-count');
const socialCaption = bigPicture.querySelector('.social__caption');
const socialCommentsContainer = bigPicture.querySelector('.social__comments');
let handleLoadMore;

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPhoto();
  }
};


const onCloseButtonClick = (evt) => {
  evt.preventDefault();
  closeBigPhoto();
};

const createComment = (comment) => {
  const li = document.createElement('li');
  li.classList.add('social__comment');

  li.innerHTML = `
    <img
      class="social__picture"
      src="${comment.avatar}"
      alt="Аватар ${comment.name}"
      width="35"
      height="35"
    >
    <p class="social__text">${comment.message}</p>
  `;

  return li;
};

function openBigPhoto(photo) {
  bigPicture.classList.remove('hidden');
  socialCcommentCount.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');
  body.classList.add('modal-open');

  bigPictureImg.src = photo.url;
  likesCount.textContent = photo.likes;
  socialCommentShownCount.textContent = photo.comments.length;
  socialCommentTotalCount.textContent = photo.comments.length;
  socialCaption.textContent = photo.description;

  socialCommentsContainer.innerHTML = '';

  const COMMENTS_PER_PAGE = 5;
  const remainingComments = [...photo.comments];
  let showCommentsCount = 0;

  const loadNextComments = () => {
    const commentsToShow = remainingComments.splice (0, COMMENTS_PER_PAGE);
    showCommentsCount += commentsToShow.length;

    socialCommentShownCount.textContent = showCommentsCount;

    const fragment = document.createDocumentFragment();

    commentsToShow.forEach((comment) => {
      fragment.append(createComment(comment));
    });

    socialCommentsContainer.append(fragment);

    if (remainingComments.length === 0) {
      commentsLoader.classList.add('hidden');
    }
  };

  loadNextComments();

  if (photo.comments.length > COMMENTS_PER_PAGE) {
    socialCcommentCount.classList.remove('hidden');
    commentsLoader.classList.remove('hidden');

    handleLoadMore = () => {
      loadNextComments();
    };

    commentsLoader.addEventListener('click', handleLoadMore);
  }

  document.addEventListener('keydown', onDocumentKeydown);
  buttonClose.addEventListener('click', onCloseButtonClick);

}

function closeBigPhoto () {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);
  buttonClose.removeEventListener('click', onCloseButtonClick);

  if (handleLoadMore) {
    commentsLoader.removeEventListener('click', handleLoadMore);
  }
}

export {openBigPhoto, closeBigPhoto,createComment};

