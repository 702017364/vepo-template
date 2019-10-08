import fs from 'fs';
import { join, relative } from 'path';
import gulp from 'gulp';
import { copySync } from './function';
import Logger from './log';
import css from './css';
import es from './es';
import server, { http } from './http';
import { refname, assets, styles, mjss } from './setting';
import table from './table';
import dev from './dev';

const bin = join(refname, table.bin);

/**
 * 页面刷新调用函数，防止频繁调用带来的性能消耗
 */
const delayReload = (() => {
  let id;
  let log = false;
  return () => {
    log || (log = new Logger());
    id && clearTimeout(id);
    id = setTimeout(() => {
      id = void 0;
      log.then();
      log = void 0;
      http.reload();
    }, 200);
  };
})();

const copyFile = (src) => {
  relative(refname, src) |> copySync(?, refname, bin);
  delayReload();
};

const unlink = (src) => {
  relative(refname, src) |> join(bin, ?) |> fs.unlinkSync;
  delayReload();
};

const change = (src) => {
  unlink(src);
  copyFile(src);
};

export default dev 
  ? gulp.parallel([
      server,
      () => gulp.watch(styles.watch, gulp.series(css)),
      () => gulp.watch(mjss, gulp.series(es)),
      (() => {
        const watcher = gulp.watch(assets);
        watcher.on('add', copyFile);
        watcher.on('unlink', unlink);
        watcher.on('change', change);
        return () => watcher;
      })(),
    ]) 
  : (cb) => cb();