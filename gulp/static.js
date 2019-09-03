import { join } from 'path';
import gulp from 'gulp';
import { refname, statics } from './setting';
import table from './table';
import dev from './dev';

export default (cb) => {
  return dev
    ? cb()
    : gulp
      .src(statics, {allowEmpty: true})
      .pipe(join(refname, table.dist, table.static) |> gulp.dest);
};