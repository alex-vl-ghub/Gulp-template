import { src, dest } from 'gulp';
import gulpif from 'gulp-if';
import { browserSyncInstance } from './server';
import config from '../config';

function video() {
  return src(`${config.src.video}/**/*.mp4`)
    .pipe(gulpif(config.isProd, dest(config.dist.video), dest(config.dev.video)))
    .pipe(browserSyncInstance.stream());
}

export default video;
