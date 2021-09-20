import { src, dest } from 'gulp';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import gulpif from 'gulp-if';
import { browserSyncInstance } from './server';
import config from '../config';

function scripts() {
  src(`${config.src.js}/polyfills/webpInCss.js`)
    .pipe(gulpif(config.isProd, dest(config.dist.js), dest(config.dev.js)));

  return src(`${config.src.js}/main.js`)
    .pipe(
      webpackStream(
        {
          output: {
            filename: 'main.min.js',
          },
          devtool: config.isDev ? 'eval' : 'source-map',
          mode: config.isDev ? 'development' : 'production',
          module: {
            rules: [
              {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
              },
            ],
          },
          // Place libraries here to exclude them from the package.
          // externals: {
          //   jquery: 'jQuery'
          // }
        },
        webpack,
        (err, stats) => {
          /* Use stats to do more things if needed */
          if (err) {
            console.log('Error: ', err);
          }
          console.log('hash: ', stats.hash);
        },
      ),
    )
    .pipe(gulpif(config.isProd, dest(config.dist.js), dest(config.dev.js)))
    .pipe(browserSyncInstance.stream());
}

export default scripts;
