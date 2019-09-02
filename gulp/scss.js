import gulp from 'gulp';
import sass from 'gulp-sass';
import NodeSass from 'node-sass';
import gulpif from 'gulp-if';
import clean from 'gulp-clean-css';
import dev from './dev';

sass.compiler = NodeSass;

export default () => {
  return gulp.src('styles/index.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulpif(!dev, clean()))
    .pipe(gulp.dest('bin'));
};