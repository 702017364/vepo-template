import fs from 'fs';
import { join } from 'path';

const CHAR = '!';
const RE_SEP = /\\+/g;

/**
 * 统一将相对路径组合成绝对路径
 * @param {String|Array|Object} src 
 * @param {String} path 
 * @return {String|Array|Object}
 */
export const resolvePath = (src, path) => {
  if(typeof src == 'string'){
    let value;
    if(src.slice(0, 1) == CHAR){
      value = src.slice(1) |> join(path, ?) |> CHAR.concat;
    } else{
      value = join(path, src);
    }
    return value.replace(RE_SEP, '/');
  } else if(src instanceof Array){
    return src.map((value) => resolvePath(value, path));
  } else{
    const obj = {};
    for(let key in src){
      obj[key] = src[key] |> resolvePath(?, path);
    }
    return obj;
  }
};

/**
 * 拷贝文件
 * @param {String} src 文件名或相对路径
 * @param {String} source src 对应的绝对路径
 * @param {String} place 存放文件的目录（src 为相对路径，则存放到对应文件夹）
 */
export const copySync = (src, source, place) => {
  const list = src.split(RE_SEP);
  const size = list.length - 1;
  for(let i = 0; i < size; i++){
    place = join(place, list[i]);
    fs.existsSync(place) || fs.mkdirSync(place);
  }
  const file = join(source, src);
  const newFile = join(place, list[size]);
  const readStream = fs.createReadStream(file);
  const writeStream = fs.createWriteStream(newFile);
  readStream.pipe(writeStream);
};

/**
 * 删除文件或文件夹
 * @param {String} src
 */
export const rmdirSync = (src) => {
  const stat = fs.lstatSync(src);
  if(stat.isDirectory()){
    fs.readdirSync(src).forEach((file) => {
      join(src, file) |> rmdirSync;
      fs.rmdirSync(src);
    });
  } else{
    fs.unlinkSync(src);
  }
};

/**
 * 创建文件夹
 * @param {String} src 文件夹名称或相对路径 
 * @param {String} place 在哪个路径下创建
 */
export const mkdirSync = (src, place) => {
  src.split(RE_SEP).forEach((value) => {
    place = join(place, value);
    fs.existsSync(place) || fs.mkdirSync(place);
  });
};

export const depthClone = (value) => {
  if(!value || typeof value != 'object') return value;
  if(value instanceof Array) return value.map(depthClone);
  const obj = {};
  for(let key in value){
    key != 'constructor'
      && value.hasOwnProperty(key)
      && (obj[key] = depthClone(value[key]));
  }
  return obj;
};