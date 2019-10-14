import gulp from 'gulp';
import babel from 'gulp-babel';
import gulpif from 'gulp-if';
import uglify from 'gulp-uglify-es';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import rollup from 'gulp-rollup';
import through2 from 'through2';
import setting, { mjss, dest } from './setting';
import dev from './dev';
import plugins from './babel-cli';

const imp = setting.import;

const rollup0 = () => {
  return typeof imp == 'object'
    ? rollup(imp)
    : through2.obj();
};

export default () => {
  return gulp
    .src(mjss, { allowEmpty: true })
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(gulpif(dev, sourcemaps.init()))
    .pipe(babel({
      babelrc: setting.babelrc,
      plugins,
    }))
    .pipe(rollup0())
    .pipe(gulpif(!dev, uglify()))
    .pipe(gulpif(dev, sourcemaps.write('./')))
    .pipe(dest('bin') |> gulp.dest);
};