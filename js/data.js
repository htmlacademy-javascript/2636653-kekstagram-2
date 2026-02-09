import {getUniqueId, getRandomInteger} from './util.js';
import {MESSAGES, NAMES, MIN_LIKES, MAX_LIKES, POSTS_COUNT, MIN_COMMENTS, MAX_COMMENTS} from './const.js';

const createComments = (createPostCommentIdGenerator) => {
  const randomMessageIndex = getRandomInteger(0, MESSAGES.length - 1);
  const randomNameIndex = getRandomInteger(0, NAMES.length - 1);
  const avatarId = getRandomInteger(1, 6);

  return {
    id: createPostCommentIdGenerator(),
    avatar: `img/avatar-${ avatarId }.svg`,
    message: MESSAGES[randomMessageIndex],
    name: NAMES[randomNameIndex],
  };
};


const createPhoto = () => {
  const id = getUniqueId();
  const commentCount = getRandomInteger (MIN_COMMENTS, MAX_COMMENTS);

  const createPostCommentIdGenerator = (() => {
    let commentId = 0;
    return () => ++commentId;
  })();

  const similarComments = Array.from({length: commentCount}, () => createComments(createPostCommentIdGenerator));

  return {
    id: id,
    url: `photos/${ id }.jpg`,
    description: `Фотография №${ id }`,
    likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
    comments: similarComments,
  };
};

const similarPhotos = Array.from({length: POSTS_COUNT}, createPhoto);

export {similarPhotos, createComments, createPhoto};
