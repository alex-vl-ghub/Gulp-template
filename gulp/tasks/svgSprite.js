import { src, dest } from 'gulp';
import svgstore from 'gulp-svgstore';
import rename from 'gulp-rename';
import gulpif from 'gulp-if';
import once from 'gulp-once';
import { browserSyncInstance } from './server';
import config from '../config';

function svgSprite() {
  return src([
    `${config.src.images}/svg/icons/**/*.svg`,
  ])
    .pipe(
      gulpif(config.isDev, once({
        namespace: 'svgSprite',
        file: '.checksums',
        fileIndent: 4,
      })),
    )
    .pipe(svgstore())
    .pipe(rename('sprite.svg'))
    .pipe(gulpif(config.isProd, dest(`${config.dist.images}/svg/sprite`), dest(`${config.dev.images}/svg/sprite`)))
    .pipe(browserSyncInstance.stream());
}

export default svgSprite;
