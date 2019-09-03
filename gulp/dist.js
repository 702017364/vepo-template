import { join } from 'path';
import gulp from 'gulp';
import setting, { refname, views } from './setting';
import table from './table';
import dev from './dev';

export default (cb) => {
  if(dev) return cb();
  gulp
    .src(views, {allowEmpty: true})
    .pipe(join(refname, table.dist, table.views) |> gulp.dest);
  if(setting.entry){
    gulp
      .src('index.html')
      .pipe(table.dist |> gulp.dest);
  }
  cb();
};