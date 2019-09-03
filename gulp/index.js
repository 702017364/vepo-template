import gulp from 'gulp';
import clean from './clean';
import css from './css';
import es from './es';
import { copy } from './assets';
import cdn from './cdn';
import statics from './static';
import dist from './dist';
import watch from './watch';

export default gulp.series(
  clean,
  css,
  es,
  copy,
  cdn,
  statics,
  dist,
  watch,
);