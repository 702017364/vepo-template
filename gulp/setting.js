import fs from 'fs';
import { join } from 'path';
import dev from './dev';
import table from './table';
import { resolvePath, depthClone } from './function';

const resolveMiddlePath = (value, key) => {
  return join(refname, key) |> resolvePath(value, ?);
};

/**
 * gulpfile.js 所在目录
 */
export const refname = do{
  const RE = /[\\\/]{1,2}[^\\\/]+$/;
  const filename = do{
    const re = /gulpfile\.(?:babel\.)?js$/;
    let cache = module.parent;
    while(!re.test(cache.filename)){
      cache = cache.parent;
    }
    cache.filename;
  };
  const index = filename.search(RE);
  filename.slice(0, index);
};

const setting = do{
  const src = join(refname, 'setting.js');
  let value = {};
  try{
    fs.statSync(src);
    value = (require(src).default |> depthClone) || {};
    let imp = value.import;
    imp || (imp = false);
    imp === 'rollup' && (imp = {});
    if(imp && typeof imp == 'object'){
      imp.input = (imp.input || 'index.js') |> resolveMiddlePath(?, table.src);
      imp.format = imp.format || 'iife';
    }
    value.import = imp;
  } catch{}
  value;
};
/**
 * gulp 环境设置
 */
export default setting;

/**
 * CSS 资源目录
 */
export const assets = ['**/*', '!REMADE.md'] |> resolveMiddlePath(?, table.assets);

/**
 * CSS 目录
 */
export const styles = {
  watch: ['**/*.scss', '!REMADE.md'],
  output: setting.output,
} |> resolveMiddlePath(?, table.styles);

/**
 * js 目录
 */
export const mjss = ['**/*.js', '!REMADE.md'] |> resolveMiddlePath(?, table.src);

/**
 * html 目录
 */
export const views = ['**/*.html', '!REMADE.md'] |> resolveMiddlePath(?, table.views);

/**
 * 静态资源目录
 */
export const statics = ['**/*', '!REMADE.md'] |> resolveMiddlePath(?, table.static);

/**
 * 发布配置
 * @param {String} key 文件夹映射属性
 * @reutrn {String} 绝对路径
 */
export const dest = (key) => {
  return (dev ? table[key] : `${table.dist}/${table[key]}`)
    |> join(refname, ?);
};