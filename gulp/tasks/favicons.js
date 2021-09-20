import { src, dest } from 'gulp';
import once from 'gulp-once';
import gulpif from 'gulp-if';
import { browserSyncInstance } from './server';
import config from '../config';

function favicons() {
  return src(`${config.src.favicons}/**/*`)
    .pipe(
      gulpif(config.isDev, once({
        namespace: 'favicons',
        file: '.checksums',
        fileIndent: 4,
      })),
    )
    .pipe(gulpif(config.isProd, dest(config.dist.favicons), dest(config.dev.favicons)))
    .pipe(browserSyncInstance.stream());
}

export default favicons;
