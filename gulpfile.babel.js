import { series, parallel } from 'gulp';
import config from './gulp/config';
import clean from './gulp/tasks/clean';
import server from './gulp/tasks/server';
import html from './gulp/tasks/html';
import watcher from './gulp/tasks/watcher';
import styles from './gulp/tasks/styles';
import scripts from './gulp/tasks/scripts';
import video from './gulp/tasks/video';
import fonts from './gulp/tasks/fonts';
import copyFontsToBuild from './gulp/tasks/copyFontsToBuild';
import images from './gulp/tasks/images';
import imagesSharp from './gulp/tasks/imagesSharp';
import svgSprite from './gulp/tasks/svgSprite';
import favicons from './gulp/tasks/favicons';

config.setEnv();

const build = series(
  clean,
  fonts,
  copyFontsToBuild,
  parallel(html, video, scripts, styles, images, imagesSharp, svgSprite, favicons),
  server,
  watcher,
);

// Series version of build task:
// const build = series(
//   clean,
//   html,
//   fonts,
//   copyFontsToBuild,
//   styles,
//   scripts,
//   video,
//   images,
//   imagesSharp,
//   svgSprite,
//   favicons,
//   server,
//   watcher,
// );

exports.build = build;
