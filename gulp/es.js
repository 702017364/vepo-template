import gulp from 'gulp';
import babel from 'gulp-babel';
import gulpif from 'gulp-if';
import uglify from 'gulp-uglify-es';
import sourcemaps from 'gulp-sourcemaps';
import setting, { mjss, dest } from './setting';
import dev from './dev';
import plugins from './babel-cli';

export default () => {
  return gulp
    .src(mjss, {allowEmpty: true})
    .pipe(gulpif(dev, sourcemaps.init()))
    .pipe(babel({
      babelrc: setting.babelrc,
      plugins,
    }))
    .pipe(gulpif(!dev, uglify()))
    .pipe(gulpif(dev, sourcemaps.write('./')))
    .pipe(dest('bin') |> gulp.dest);
};