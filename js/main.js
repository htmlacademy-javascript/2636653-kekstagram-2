import {similarPhotos} from './data.js';
import { renderThumbnails } from './thumbnails.js';
import { initUploadForm } from './form.js';
initUploadForm();
renderThumbnails(similarPhotos);
