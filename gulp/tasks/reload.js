import { browserSyncInstance } from './server';

function reload(done) {
  browserSyncInstance.reload();
  done();
}

export default reload;
