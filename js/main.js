const MESSAGE = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

const NAMES = ['Сергей', 'Иван', 'Дмитрий', 'Роман', 'Александр', 'Виктория', 'Ольга', 'Светлана', 'Михаил', 'Анастасия', 'Валентина', 'Петр', 'Виктор',];
const MIN_LIKES = 15;
const MAX_LIKES = 200;
const PHOTO_ARRAY = 25;

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
    do {
      num = getRandomInteger(1, 25);
    } while (used.includes(num));
    used.push(num);
    return num;
  };
})();


const createPhoto = () => {
  const randomNameIndex = getRandomInteger(0, NAMES.length - 1);
  const randomMessageIndex = getRandomInteger(0, MESSAGE.length - 1);
  const id = getUniqueId();
  const avatarId = getRandomInteger(1, 6);

  return {
    id: id,
    url: `photos/${ id }.jpg`,
    message: MESSAGE[randomMessageIndex],
    name: NAMES[randomNameIndex],
    likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
    avatar: `img/avatar-${ avatarId }.svg`,
  };
};

const similarPhotos = Array.from({length: PHOTO_ARRAY}, createPhoto);

console.log(similarPhotos);
