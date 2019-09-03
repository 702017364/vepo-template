import fs from 'fs';
import { join } from 'path';
import gulp from 'gulp';
import clean from 'gulp-clean';
import gulpif from 'gulp-if';
import { assets, refname } from './setting';
import table from './table';
import dev from './dev';

const bin = `${table.bin}/${table.assets}`;
const value = (dev ? bin : `${table.dist}/${bin}`) |> join(refname, ?);

const condition = () => {
  let isA = false;
  try{
    const folder =  `../${bin}` |> join(refname, ?) |> fs.statSync;
    isA = folder.isDirectory();
  } catch{}
  return isA;
};

export const sweep = () => {
  return gulp
    .src(bin, {allowEmpty: true})
    .pipe(gulpif(condition, clean()));
};

export const copy = () => {
  return gulp
    .src(assets, {allowEmpty: true})
    .pipe(gulp.dest(value));
};