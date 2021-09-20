import { src, dest } from 'gulp';
import imagemin from 'gulp-imagemin';
import once from 'gulp-once';
import gulpif from 'gulp-if';
import { browserSyncInstance } from './server';
import config from '../config';

function images() {
  return src([
    `${config.src.images}/**/*.+(gif|svg|ico)`,
  ])
    .pipe(
      gulpif(config.isDev, once({
        namespace: 'images',
        file: '.checksums',
        fileIndent: 4,
      })),
    )
    .pipe(
      imagemin(
        [
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 75, progressive: true }),
          imagemin.optipng({ optimizationLevel: 3 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
          }),
        ],
        {
          verbose: true,
          silent: false,
        },
      ),
    )
    .pipe(gulpif(config.isProd, dest(config.dist.images), dest(config.dev.images)))
    .pipe(browserSyncInstance.stream());
}

export default images;
