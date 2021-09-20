import { src, dest } from 'gulp';
import posthtml from 'gulp-posthtml';
import include from 'posthtml-include';
import ejs from 'gulp-ejs';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import gulpif from 'gulp-if';
import config from '../config';

function html() {
  const path = config.src.html;
  const plugins = [include({ root: path })];

  return src(`${config.src.html}/*.html`)
    .pipe(posthtml(plugins))
    .pipe(ejs())
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulpif(config.isProd, dest(config.dist.html), dest(config.dev.html)));
}

export default html;
