const MESSAGE = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

const NAMES = ['Сергей', 'Иван', 'Дмитрий', 'Роман', 'Александр', 'Виктория', 'Ольга', 'Светлана', 'Михаил', 'Анастасия', 'Валентина', 'Петр', 'Виктор',];
const MIN_LIKES = 15;
const MAX_LIKES = 200;
const POSTS_COUNT = 25;
const MIN_COMMENTS = 0;
const MAX_COMMENTS = 30;

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getUniqueId = (() => {
  const used = [];
  return () => {
    let num;
    num = getRandomInteger(1, 25);
    while (used.includes(num)) {
      num = getRandomInteger(1, 25);
    }
    used.push(num);
    return num;
  };
})();


const createComments = (createPostCommentIdGenerator) => {
  const randomMessageIndex = getRandomInteger(0, MESSAGE.length - 1);
  const randomNameIndex = getRandomInteger(0, NAMES.length - 1);
  const avatarId = getRandomInteger(1, 6);

  return {
    id: createPostCommentIdGenerator(),
    avatar: `img/avatar-${ avatarId }.svg`,
    message: MESSAGE[randomMessageIndex],
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

console.dir(similarPhotos, { depth: null });
