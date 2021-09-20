const srcPath = 'src';
const distPath = 'dist';
const devPath = 'dev';

const config = {
  src: {
    root: srcPath,
    scss: `${srcPath}/scss`,
    js: `${srcPath}/js`,
    fonts: `${srcPath}/assets/fonts`,
    generatedFonts: `${srcPath}/assets/fonts/generatedFonts`,
    images: `${srcPath}/assets/images`,
    iconsMono: `${srcPath}/assets/icons/mono`,
    iconsMulti: `${srcPath}/assets/icons/multi`,
    html: `${srcPath}/html`,
    video: `${srcPath}/assets/video`,
    favicons: `${srcPath}/assets/favicons`,
  },

  dist: {
    root: distPath,
    html: distPath,
    css: `${distPath}/css`,
    js: `${distPath}/js`,
    fonts: `${distPath}/fonts`,
    images: `${distPath}/images`,
    video: `${distPath}/video`,
    favicons: `${distPath}/favicons`,
  },

  dev: {
    root: devPath,
    html: devPath,
    css: `${devPath}/css`,
    js: `${devPath}/js`,
    fonts: `${devPath}/fonts`,
    images: `${devPath}/images`,
    video: `${devPath}/video`,
    favicons: `${devPath}/favicons`,
  },

  setEnv() {
    this.isProd = process.argv.includes('--prod');
    this.isDev = !this.isProd;
  },
};

export default config;
