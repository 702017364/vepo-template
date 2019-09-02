/* 拷贝 js 库 */
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';

function copyPackage(name){
  const root = path.join(__dirname, '../');
  const {
    dependencies,
  } = require(path.join(root, 'package.json'));
  if(name in dependencies ^ 1){
    return console.error(`Not "${name}" package`);
  };
  const pkg = path.join(root, `node_modules/${name}/`);
  let lib = path.join(root, 'libs');
  fs.existsSync(lib) || fs.mkdirSync(lib);
  if(name.indexOf('/') > 0){
    const list = name.split('/');
    name = list.pop();
    list.forEach(value => {
      lib = path.join(lib, value);
      fs.existsSync(lib) || fs.mkdirSync(lib);
    });
  }
  const folder = path.join(lib, name);
  if(fs.existsSync(folder)){
    fs.readdirSync(folder).forEach(file => fs.unlinkSync(path.join(folder, file)));
    fs.rmdirSync(folder);
  }
  const {
    main,
    module,
  } = require(`${pkg}package.json`);
  if(!main) return;
  const list = new Set();
  list.add(main);
  module && list.add(module);
  if(main.indexOf('.min') == -1){
    const slice = main.slice(0, -3);
    list.add(slice + '.min.js');
    list.add(slice + '.debug.js');
  } else{
    const slice = main.slice(0, -7);
    list.add(slice + '.js');
    list.add(slice + '.debug.js');
  }
  fs.mkdir(folder, err => {
    if(err) return console.log(err);
    list.forEach(value => {
      const file = path.join(pkg, value);
      fs.exists(file, exists => {
        if(!exists) return;
        const readStream = fs.createReadStream(file);
        const fileName = value.split('\/').pop().replace(name, 'index');
        const writeStream = fs.createWriteStream(`${folder}/${fileName}`);
        readStream.pipe(writeStream);
      });
    });
  });
}

const packages = minimist(process.argv.slice(2))._;
packages && packages.forEach(copyPackage);