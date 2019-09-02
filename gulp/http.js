import gulp from 'gulp';
import bs from 'browser-sync';

const http = bs.create();
const watchs = [
  'index.html',
  'bin/**/*',
  'page/**/*.html',
];

export default () => {
  http.init({
    server: {
      baseDir: './',
    },
  });
  return gulp
    .watch(watchs)
    .on('change', () => http.reload());
};