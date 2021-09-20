import 'regenerator-runtime/runtime';
import { src, dest } from 'gulp';
import sharp from 'sharp';
import through2 from 'through2';
import once from 'gulp-once';
import gulpif from 'gulp-if';
import { browserSyncInstance } from './server';
import config from '../config';

config.setEnv();

const globalImageOptimizationSettings = {
  jpg: { quality: 90, progressive: true, mozjpeg: true },
  png: {
    progressive: true,
    compressionLevel: 6, // zlib compression level, 0(fastest, largest) to 9(slowest, smallest)
    adaptiveFiltering: false,
    quality: 100,
  },
  webp: {
    quality: 90,
    alphaQuality: 100,
    lossless: false,
    nearLossless: false,
    smartSubsample: false,
    reductionEffort: 4, // level of CPU effort to reduce file size, integer 0-6
  },
};

const globalResizeRatios = [
  { ratio: 1, suffix: '' },
  { ratio: 2, suffix: '@2x' },
  { ratio: 3, suffix: '@3x' },
];

const options = [
  {
    initialFormat: 'jpg',
    srcPath: `${config.src.images}/**/*.+(jpg|jpeg)`,
    outputPath: config.isProd ? `${config.dist.images}` : `${config.dev.images}`,
    toFormats: [
      {
        format: 'webp',
        optimize: true,
        optimizeOptions: false,
        resize: true,
        resizeRatios: false,
      },
      {
        format: 'jpg',
        optimize: true,
        optimizeOptions: false,
        resize: true,
        resizeRatios: false,
      },
    ],
  },
  {
    initialFormat: 'png',
    srcPath: `${config.src.images}/**/*.+(png)`,
    outputPath: config.isProd ? `${config.dist.images}` : `${config.dev.images}`,
    toFormats: [
      {
        format: 'webp',
        optimize: true,
        optimizeOptions: false,
        resize: true,
        resizeRatios: false,
      },
      {
        format: 'png',
        optimize: true,
        optimizeOptions: false,
        resize: true,
        resizeRatios: false,
      },
    ],
  },
];

async function getOptimizedImages(image, option) {
  const { toFormats, initialFormat } = option;
  const sharpImage = sharp(image);
  let optimizedImages = [];

  const imageMetadata = await sharpImage
    .metadata()
    .then((metadata) => metadata);

  const { width } = imageMetadata;

  toFormats.forEach((toFormat) => {
    const formattedAndResizedImages = [];
    const { format, optimize, optimizeOptions, resize, resizeRatios } = toFormat;

    let formattedSharpImage = sharpImage.clone();

    if (format !== initialFormat) {
      formattedSharpImage = formattedSharpImage.toFormat(format);
    }

    if (resize) {
      (resizeRatios || globalResizeRatios).forEach((resizeRatio) => {
        if (resizeRatio.ratio === 1) {
          formattedAndResizedImages.push({
            image: formattedSharpImage.clone(),
            suffix: resizeRatio.suffix,
            format,
          });
        }

        if (resizeRatio.ratio !== 1) {
          formattedAndResizedImages.push({
            image: formattedSharpImage
              .clone()
              .resize(Math.round(width * resizeRatio.ratio)),
            suffix: resizeRatio.suffix,
            format,
          });
        }
      });
    } else {
      formattedAndResizedImages.push({
        image: formattedSharpImage.clone(),
        suffix: '',
        format,
      });
    }

    if (optimize) {
      formattedAndResizedImages.forEach((formattedImage) => {
        switch (formattedImage.format) {
          case 'jpg':
            optimizedImages.push({
              image: formattedImage.image.jpeg(
                optimizeOptions || globalImageOptimizationSettings.jpg,
              ),
              suffix: formattedImage.suffix,
              format: formattedImage.format,
            });
            break;

          case 'webp':
            optimizedImages.push({
              image: formattedImage.image.webp(
                optimizeOptions || globalImageOptimizationSettings.webp,
              ),
              suffix: formattedImage.suffix,
              format: formattedImage.format,
            });
            break;

          case 'png':
            optimizedImages.push({
              image: formattedImage.image.png(
                optimizeOptions || globalImageOptimizationSettings.png,
              ),
              suffix: formattedImage.suffix,
              format: formattedImage.format,
            });
            break;

          default:
            console.log('Unsupported  format');
            break;
        }
      });
    } else {
      optimizedImages = formattedAndResizedImages;
    }
  });

  const resolvedImages = await Promise.all(
    optimizedImages.map((img) => img.image.toBuffer()),
  );

  const result = [];

  optimizedImages.forEach((img, i) => {
    result.push({
      image: resolvedImages[i],
      suffix: img.suffix,
      format: img.format,
    });
  });

  return result;
}

function imagesSharp() {
  const promises = options.map((option) => {
    const { outputPath, srcPath } = option;

    return new Promise((resolve, reject) => {
      src(srcPath)
        .pipe(
          gulpif(config.isDev, once({
            namespace: 'imagesSharp',
            file: '.checksums',
            fileIndent: 4,
          })),
        )
        .pipe(
          through2.obj(async function through2Async(file, enc, callback) {
            const optimizedImages = await getOptimizedImages(
              file.contents,
              option,
            );

            for (let i = 0; i < optimizedImages.length; i += 1) {
              const { suffix, format, image } = optimizedImages[i];
              const outputFile = file.clone();
              outputFile.contents = image;
              outputFile.path = `${file.dirname}/${file.stem}${suffix}.${format}`;
              this.push(outputFile);
            }

            callback();
          }),
        )
        .on('error', (e) => {
          console.log('ERROR, REJECTED: ', e);
          reject();
        })
        .pipe(dest(outputPath))
        .on('end', () => {
          console.log('RESOLVED: ', option.initialFormat);
          resolve();
        });
    });
  });

  return Promise.all(promises).then(() => {
    src(config.src.images, { read: false })
      .pipe(browserSyncInstance.stream());
  });
}

export default imagesSharp;
