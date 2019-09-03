import fs from 'fs';
import { join } from 'path';
import { rmdirSync, mkdirSync } from './function';
import Logger from './log';
import setting, { refname, dest } from './setting';

const cdnCustom = do{
  let option = {};
  try{
    const path = join(refname, 'setting.cdn.js');
    fs.statSync(path);
    option = require(path).default;
  } catch{};
  option;
};

const CDN = dest('cdn');

const RE_CUT = /^\/+|\/+$/g;
const RE_JS = /\.js$/;
const RE_NAME = /[^.]+/;
const RE_OPTIM = /^([^\<\>.]*?)(?:\<([^\<\>.]*)\>)?([^\<\>]+)$/;
const RE_HAS = /[\\\/][^\\\/]*$/;
const RE_ALIAS = /[^\\\/]+$/g;

const copyAsync = async (source, place) => {
  if(!fs.existsSync(source)) return;
  if(fs.lstatSync(source).isDirectory()){
    const files = fs.readdirSync(source);
    for(let i = 0, j = files.length; i < j; i++){
      const file = files[i];
      await copyAsync(
        join(source, file),
        join(place, file),
      );
    }
  } else{
    const index = place.search(RE_HAS);
    if(index > -1){
      const src = (index > -1 ? index : void 0) |> place.slice(0, ?);
      mkdirSync(src, CDN);
    }
    const readStream = fs.createReadStream(source);
    const writeStream = join(CDN, place) |> fs.createWriteStream;
    readStream.pipe(writeStream);
    await new Promise((resolve) => readStream.on('end', () => {
      resolve();
    }));
  }
};

class CopyClass{
  constructor(list){
    this.list = list;
  }

  get dependencies(){
    const cache = this._dependencies;
    if(cache) return cache;
    const {
      dependencies,
      devDependencies,
    } = join(refname, 'package.json') |> require;
    return this._dependencies = Object.assign(dependencies, devDependencies);
  }

  async then(){
    mkdirSync(CDN, './');
    const list = this.list;
    for(let i = 0, j = list.length; i < j; i++){
      const value = list[i];
      this.clear(value);
      const cache = cdnCustom?.[value];
      const basic = join(refname, 'node_modules', value);
      const option = cache ? this.configurat(basic, cache) : this.search(basic);
      let log = new Logger(value);
      for(let key in option){
        const cache = join(value, key);
        await copyAsync(option[key], cache);
      }
      log.then();
    }
    this.merge();
  }

  /**
   * 解析自定义拷贝
   * @param {Srring} basic 包所在路径
   * @param {Array} list 自定义列表
   * @return {Object}
   */
  configurat(basic, list){
    const cache = {};
    list.forEach((value) => {
      const [src, alias] = value.split('|');
      const matchs = src.match(RE_OPTIM);
      if(!matchs) throw new Error(`Wrong format of "${src}"`);
      const [_, $1, $2, $3] = matchs.map((value, index) => index && value.replace(RE_CUT, ''));
      const key = (alias ? $3.replace(RE_ALIAS, alias) : $3) |> join($1, ?);
      cache[key] = join(basic, $1, $2, $3);
    });
    return cache;
  }

  /**
   * 默认拷贝
   * @param {String} basic 包所在路径
   * @return {Object}
   */
  search(basic){
    const {
      main, 
      module,
    } = this.searchMain(basic) || {};
    const [dir, temp] = do{
      if(main){
        const index = main.search(RE_HAS);
        [
          `./${main.slice(0, index)}`,
          RE_NAME.exec(main.slice(index + 1, -3))[0]
        ];
      } else{
        ['./', 'index'];
      }
    };
    const cache = join(dir, temp);
    let file;
    [
      `${cache}.min.js`,
      `${cache}.js`,
      main,
      `${cache}.debug.js`,
      module,
    ].some((value) => {
      if(!value) return;
      const src = join(basic, value);
      if(fs.existsSync(src)){
        file = src;
        return true;
      }
    });
    if(!file) throw new Error('Not found');
    return {
      ['index.js']: file,
    };
  }

  /**
   * 从 package.json 查找数据
   * @param {String} src
   * @return {Object}
   */
  searchMain(src){
    const json = join(src, 'package.json');
    if(!fs.existsSync(json)) return;
    const {
      main,
      module,
    } = require(json);
    const cache = {};
    module && (cache.module = module);
    main 
      && RE_JS.test(main)
      && (cache.main = main);
    return cache;
  }

  /**
   * 清除已拷贝的安装包
   * @param {String} name 包名
   */
  clear(name){
    if(name in this.dependencies ^ 1) throw new Error(`Not "${name}" package`);
    const cache = join(CDN, name);
    fs.existsSync(cache) && rmdirSync(cache);
  }

  merge(){
    const list = CopyClass.foramtMerge();
    if(!list) return;
    const path = dest('cdn') |> join(?, 'index.js');
    list.forEach((value, index) => {
      index && fs.appendFileSync(path, '\n');
      fs.readFileSync(value, 'utf-8') |> fs.appendFileSync(path, ?);
    });
  }

  static foramtMerge(){
    const list = setting.merge;
    if(!Array.isArray(list) || !list.length) return;
    const inspect = (src, value) => {
      if(!fs.existsSync(src)) throw new Error(`Not found '${value}'`);
    };
    const path = dest('cdn');
    return list.map((value) => {
      let src = value.slice(0, 1) == '/'
        ? join(refname, value.slice(1))
        : join(path, value);
      inspect(src, value);
      fs.statSync(src).isDirectory() && (src = join(src, 'index.js'));
      inspect(src, value);
      return src;
    });
  }
}

export default async (list) => await new CopyClass(list).then();