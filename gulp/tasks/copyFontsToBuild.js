import { src, dest } from 'gulp';
import gulpif from 'gulp-if';
import once from 'gulp-once';
import { browserSyncInstance } from './server';
import config from '../config';

function copyFontsToBuild() {
  return src(`${config.src.generatedFonts}/**/*.+(otf|ttf|woff|woff2)`)
    .pipe(
      gulpif(config.isDev, once({
        namespace: 'copyFontsToBuild',
        file: '.checksums',
        fileIndent: 2,
      })),
    )
    .pipe(gulpif(config.isProd, dest(config.dist.fonts), dest(config.dev.fonts)))
    .pipe(browserSyncInstance.stream());
}

export default copyFontsToBuild;
