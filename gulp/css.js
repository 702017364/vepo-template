import gulp from 'gulp';
import sass from 'gulp-sass';
import NodeSass from 'node-sass';
import gulpif from 'gulp-if';
import clean from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import { dest, styles } from './setting';
import dev from './dev';

sass.compiler = NodeSass;

export default () => {
  return gulp
    .src(styles.output, {allowEmpty: true})
    .pipe(gulpif(dev, sourcemaps.init()))
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulpif(!dev, clean()))
    .pipe(gulpif(dev, sourcemaps.write('./')))
    .pipe(dest('bin') |> gulp.dest);
};