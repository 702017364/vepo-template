import gulp from 'gulp';
import babel from 'gulp-babel';
import gulpif from 'gulp-if';
import uglify from '../node/uglify';
import plugins from '../node/babel-libs';
import dev from './dev';

export default () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      babelrc: false,
      plugins,
    }))
    .pipe(gulpif(!dev, uglify()))
    .pipe(gulp.dest('bin'));
};