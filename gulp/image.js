import gulp from 'gulp';
import clean from 'gulp-clean';
import gulpif from 'gulp-if';

const bin  = '/bin/images/';

const condition = () => {
  let isA;
  try{
    const folder = fs.statSync(bin);
    isA = folder.isDirectory();
  } catch{}
  console.log(isA);
  return isA;
};

export const sweep = () => {
  return gulp.src(bin, {
    allowEmpty: true,
  })
    .pipe(gulpif(condition, clean()));
};

export const copy = () => {
  return gulp.src(['images/**/*', '!images/PATH.MD'])
    .pipe(gulp.dest(bin));
};