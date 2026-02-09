const template = document.querySelector('#picture').content.querySelector('.picture');
const container = document.querySelector('.pictures');
const fragment = document.createDocumentFragment();

const createThumbnails = (photo) => {
  const thumbnails = template.cloneNode(true);
  const image = thumbnails.querySelector('.picture__img');

  image.src = photo.url;
  image.alt = photo.description;

  thumbnails.querySelector('.picture__comments').textContent = photo.comments.length;
  thumbnails.querySelector('.picture__likes').textContent = photo.likes;

  return thumbnails;
};


const renderThumbnails = (photos) => {
  photos.forEach((photo) => {
    fragment.append(createThumbnails(photo));
  });

  container.append(fragment);
};

export { renderThumbnails };
