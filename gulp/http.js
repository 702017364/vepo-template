import bs from 'browser-sync';
import proxy from 'http-proxy-middleware';
import watch from 'gulp-watch';
import Logger from './log';
import setting from './setting';
import table from './table';

export const http = bs.create();

const server = do{
  const target = setting.targetProxy;
  const option = {
    baseDir: './',
  };
  if(target){
    const api = proxy('/api', {
      target,
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      },
      logLevel: 'debug'
    });
    option.middleware = [api];
  }
  option;
};

const listWatch = do{
  const list = [];
  setting.entry && list.push('index.html');
  list.push(
    `${table.bin}/**/*`,
    `${table.views}/**/*.html`,
    `${table.static}/**/*`,
  );
  list;
};

const RE_TYPE = new RegExp(`([\\\\\\\/])(${table.views}|${table.static}|${table.bin})\\1`, 'i');

export default () => {
  http.init({server});
  return watch(listWatch, (vinyl) => {
    const matchs = vinyl.path.match(RE_TYPE);
    const type = matchs ? matchs[2] : 'index.html';
    type && type != table.bin && Logger.log(new Date(), 'Changed', type, '')
    http.reload();
  });
};