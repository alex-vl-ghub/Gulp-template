import { series, watch } from 'gulp';
import html from './html';
import reload from './reload';
import styles from './styles';
import config from '../config';
import scripts from './scripts';
import video from './video';
import fonts from './fonts';
import copyFontsToBuild from './copyFontsToBuild';
import images from './images';
import imagesSharp from './imagesSharp';
import svgSprite from './svgSprite';
import favicons from './favicons';

function watcher() {
  watch(`${config.src.html}/**/*.html`, series(html, reload));
  watch(`${config.src.scss}/**/*.scss`, styles);
  watch(`${config.src.js}/**/*.js`, scripts);
  watch(`${config.src.video}/**/*.mp4`, video);
  watch([`${config.src.fonts}/**/*.+(woff|woff2|ttf|otf|)`, `!${config.src.generatedFonts}/**/*`], series(fonts, copyFontsToBuild));
  watch(
    [
      `${config.src.images}/**/*.+(gif|svg|ico)`,
    ],
    series(images, reload),
  );
  watch(`${config.src.images}/**/*.+(jpg|jpeg|png)`, imagesSharp);
  watch(`${config.src.images}/**/*.svg`, svgSprite);
  watch(`${config.src.favicons}/**/*`, favicons);
}

export default watcher;
