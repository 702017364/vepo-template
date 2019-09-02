import fs from 'fs';
import gulp from 'gulp';
import clean from 'gulp-clean';
import gulpif from 'gulp-if';

export default () => {
  let isA;
  try{
    const folder = fs.statSync('bin');
    isA = folder.isDirectory();
  } catch{
    fs.mkdirSync('bin');
  }
  return gulp.src('bin')
    .pipe(gulpif(isA, clean()));
};