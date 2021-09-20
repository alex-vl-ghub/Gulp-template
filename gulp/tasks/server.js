import browserSync from 'browser-sync';
import config from '../config';

const browserSyncInstance = browserSync.create();

function server(done) {
  browserSyncInstance.init({
    server: {
      baseDir: config.isProd ? `${config.dist.root}` : `${config.dev.root}`,
    },
    cors: true,
    notify: false,
    ui: false,
    open: true,
    reloadOnRestart: true,
  });
  done();
}

export default server;
export { browserSyncInstance };
