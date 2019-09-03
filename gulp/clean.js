import fs from 'fs';
import { join } from 'path';
import gulp from 'gulp';
import clean from 'gulp-clean';
import { refname } from './setting';
import table from './table';
import dev from './dev';

/**
 * 检测路径是否存在，存在则回调
 * @param {String} src 
 * @param {Function} callback
 */
const detect = (src, callback) => {
  const path = join(refname, src);
  try{
    fs.statSync(path);
    typeof callback == 'function' && callback(path);
  } catch{}
};

export default (cb) => {
  const list = [];
  const push = [].push.bind(list);
  detect(table.bin, dev && push);
  detect(table.cdn, dev && push);
  detect(table.dist, dev || push);
  return list.length
    ? gulp.src(list, {allowEmpty: true}).pipe(clean())
    : cb();
};