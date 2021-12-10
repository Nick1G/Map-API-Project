const {src , dest, series} = require('gulp');
const sourcemaps = require('gulp-sourcemaps');

function pagesTask() {
  return src('src/*.html')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

function stylesTask() {
  return src('src/*.css')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

function scriptsTask() {
  return src('src/*.js')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

exports.default = series(pagesTask, stylesTask, scriptsTask);