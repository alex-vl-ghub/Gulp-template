// TODO: При удалении файла .checksums
// происходит дублирование подключений шрифтов в CSS.
// Возможное решение: Не удалять .checksums.
// Или удалять .checksums вместе с _fonts.scss.

import { src, dest } from 'gulp';
import fontEditor from 'fonteditor-core';
import once from 'gulp-once';
import through2 from 'through2';
import path from 'path';
import fs from 'fs';
import config from '../config';

function readWoff2(file) {
  const { Font, woff2 } = fontEditor;
  return woff2.init().then(() => Font.create(file.contents, { type: 'woff2' }));
}

function writeWoff2(font) {
  const { woff2 } = fontEditor;
  return woff2.init().then(() => font.write({ type: 'woff2' }));
}

async function readFontData(file, extension) {
  let font;
  if (extension === 'woff2') {
    font = await readWoff2(file);
  } else {
    const { Font } = fontEditor;
    font = Font.create(file.contents, {
      type: extension, // support ttf, woff, woff2, eot, otf, svg
      hinting: true, // save font hinting
      compound2simple: false, // transform ttf compound glyph to simple
      inflate: null, // inflate function for woff
      combinePath: false, // for svg path
    });
  }
  return font;
}

async function appendMixinToFontScss(file, font) {
  const fontObject = font.get();
  const OS = 'OS/2';
  const fontFamily = file.stem.split('-')[0];
  const fontWeight = fontObject[OS].usWeightClass;
  const fontsScss = `${config.src.scss}/base/_fonts.scss`;

  fs.appendFile(fontsScss, `@include font-face('${fontFamily}', '${file.stem}', ${fontWeight});\n`, () => { });
}

async function writeFontFile(font, outputFormat) {
  let convertedFont;
  if (outputFormat === 'woff2') {
    convertedFont = await writeWoff2(font);
  } else {
    convertedFont = font.write({
      type: outputFormat, // support ttf, woff, woff2, eot, svg
      hinting: true, // save font hinting
      deflate: null, // deflate function for woff
    });
  }
  return { convertedFont, format: outputFormat };
}

async function getConvertedFonts(extension, font) {
  const convertedFonts = [];

  switch (extension) {
    case 'ttf':
      convertedFonts.push(await writeFontFile(font, 'woff'));
      convertedFonts.push(await writeFontFile(font, 'woff2'));
      break;
    case 'woff':
      convertedFonts.push(await writeFontFile(font, 'woff2'));
      convertedFonts.push(await writeFontFile(font, 'ttf'));
      break;
    case 'woff2':
      convertedFonts.push(await writeFontFile(font, 'woff'));
      convertedFonts.push(await writeFontFile(font, 'ttf'));
      break;
    case 'otf':
      convertedFonts.push(await writeFontFile(font, 'woff'));
      convertedFonts.push(await writeFontFile(font, 'woff2'));
      convertedFonts.push(await writeFontFile(font, 'ttf'));
      break;

    default:
      break;
  }

  return convertedFonts;
}

function fonts() {
  return src([`${config.src.fonts}/**/*.+(otf|ttf|woff|woff2)`, `!${config.src.generatedFonts}/**/*`])
    .pipe(
      once({
        namespace: 'fontEditor',
        file: '.checksums',
        fileIndent: 2,
      }),
    )
    .pipe(
      through2.obj(async function through2Async(file, enc, callback) {
        const extension = path.extname(file.path).substring(1);
        const font = await readFontData(file, extension);
        const convertedFonts = await getConvertedFonts(extension, font);

        await appendMixinToFontScss(file, font);

        for (let i = 0; i < convertedFonts.length; i += 1) {
          const { convertedFont, format } = convertedFonts[i];
          const outputFile = file.clone();
          outputFile.contents = convertedFont;
          outputFile.path = `${file.dirname}/${file.stem}.${format}`;
          this.push(outputFile);
        }

        if (extension !== 'otf') {
          this.push(file);
        }

        callback();
      }),
    )
    .pipe(dest(config.src.generatedFonts));
}

export default fonts;
