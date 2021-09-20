import del from 'del';
import config from '../config';

function clean() {
  return config.isProd
    ? del([
      `${config.dist.root}/**`,
    ])
    : del([
      `${config.dev.root}/**`,
      `!${config.dev.root}`,
      `!${config.dev.root}/images`,
      `!${config.dev.root}/fonts`,
      `!${config.dev.root}/favicons`,
    ]);
}

export default clean;
