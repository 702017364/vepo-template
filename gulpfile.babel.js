import gulp from 'gulp';
import cleanTask from './gulp/clean';
import scssTask from './gulp/scss';
import esTask from './gulp/es';
import {copy} from './gulp/image';
import watchs from './gulp/watch';

gulp.task('default', gulp.series([
  cleanTask,
  scssTask,
  esTask,
  copy,
  watchs,
]));