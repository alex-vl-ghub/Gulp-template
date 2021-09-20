// import nodeSass from 'node-sass';
import { src, dest } from 'gulp';
import Fiber from 'fibers';
import sass from 'gulp-sass';
import dartSass from 'sass';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import webpInCss from 'webp-in-css/plugin';
import autoprefixer from 'autoprefixer';
import csso from 'gulp-csso';
import sourcemaps from 'gulp-sourcemaps';
import gulpif from 'gulp-if';
import { browserSyncInstance } from './server';
import config from '../config';

const cssoDevConfig = {
  restructure: false,
  sourceMap: true,
  debug: false,
};

// sass.compiler = nodeSass;
sass.compiler = dartSass;

function styles() {
  return src(`${config.src.scss}/main.scss`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ fiber: Fiber }).on('error', sass.logError))
    .pipe(postcss([webpInCss(), autoprefixer()]))
    .pipe(gulpif(config.isProd, csso(), csso(cssoDevConfig)))
    .pipe(sourcemaps.write('.'))
    .pipe(gulpif(config.isProd, dest(config.dist.css), dest(config.dev.css)))
    .pipe(browserSyncInstance.stream());
}

export default styles;
