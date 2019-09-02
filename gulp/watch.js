import gulp from 'gulp';
import scss from './scss';
import es from './es';
import {sweep, copy} from './image';
import http from './http';
import dev from './dev';

export default dev ? gulp.parallel([
  http,
  () => gulp.watch('styles/**/*.scss', gulp.series(scss)),
  () => gulp.watch('src/**/*.js', gulp.series(es)),
  () => gulp.watch(['images/**/*'], gulp.series([sweep, copy])),
]) : [];