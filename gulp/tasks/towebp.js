import { src, dest } from 'gulp';
import imagemin from 'gulp-imagemin';
import imageminWebp from 'imagemin-webp';
import rename from 'gulp-rename';
import once from 'gulp-once';
import gulpif from 'gulp-if';
import config from '../config';
import { browserSyncInstance } from './server';

function towebp() {
  return src([
    `${config.src.images}/**/*.+(jpg|jpeg|png)`,
    `!${config.src.images.icons}/icons/**`,
  ])

    .pipe(
      gulpif(config.isDev, once({
        namespace: 'towebp',
        file: '.checksums',
        fileIndent: 4,
      })),
    )
    .pipe(imagemin([imageminWebp({ quality: 80 })]))
    .pipe(
      rename({
        extname: '.webp',
        dirname: '',
      }),
    )
    .pipe(gulpif(config.isProd, dest(config.dist.images), dest(config.dev.images)))
    .pipe(browserSyncInstance.stream());
}

export default towebp;
