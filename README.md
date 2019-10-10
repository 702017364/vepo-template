# @vope/template

## AD
* 开发环境下开启 web 服务器
* 支持代理服务器
* 监听 styles 目录下 .scss 文件变化，编译 SCSS 并自动刷新浏览器
* 监听 src 目录下 .js 文件变化，编译 js 并自动刷新浏览器
* 监听 assets 目录下文件变化，自动刷新浏览器
* 监听 index.html 文件和 views 目录下 .html 文件变化，自动刷新浏览器
* 启动时会根据设置自动从安装包中拷贝出 cdn
* 发布时自动将所有文件整理到 dist 目录

## NPM 命令
```bash
# 开发环境
npm run dev
# 发布
npm run build
```

## 拉取并启动
```
git clone https://github.com/702017364/vepo-template.git template
cd template
npm install
npm run dev
```

## 使用说明
* assets CSS 资源目录（主要为背景图和字体）
* views 子页面目录（html 文件）
* src 源码目录（js 文件）
* styles 样式目录（scss 文件）
* static 静态资源目录（页面引用的图片、视频、数据文件等）
* dist 发布目录
* [entry](setting.js)：是否使用 index.html 文件（默认值：true）
* [babelrc](setting.js)：是否开启 es5 语法编译（默认值：false）
* [output](setting.js)：设置样式编译出口（多个值则代表多个出口）（默认值：'index.scss'）
* [import](setting.js)：设置 import 的编译方式（默认值：false）
  - false 按默认行为处理（babelrc 值为 fasle 不进行编译，为 true 则会被编译为 amd 格式）
  - 'amd' 编译为 amd 格式
  - 'commonjs' 编译为 commonjs 格式
  - 'systemjs' 编译为 systemjs 格式
  - 'umd' 编译为 umd 格式
  - 对象类型（非 null） 使用模块打包器进行打包（参考：https://www.npmjs.com/package/gulp-rollup）
    * input 定义打包入口（默认值： 'index.js'）
    * format 定义打包格式（默认值： 'iife'）
  - 'rollup' 使用模块打包器进行打包（默认设置）
* [cdn](setting.js)：设置 cdn 的安装包名（默认值：[]）
* [merge](setting.js)：设置需要合并的 cdn （默认值：[]）
  - '/' 打头视为从当前跟目录开始查找的相对路径
  - 其它则视为从 cdn 目录开始查找的安装包下文件的相对路径
  - 仅指定目录名的会自动指向该目录下的 index.js 文件
* [babelcli](setting.js)：设置 babel 插件（默认值：[]）
* [flag](setting.js)：设置 babel 插件添加的方式（默认值：'r'）
  - 'w' 覆盖性添加，不使用原来的设置
  - 'r' 在原有的设置上进行追加
  - Function 调用函数（参数为原有的设置），返回一个新的设置
* [targetProxy](setting.js)：设置代理服务器，要求代理接口以 '/api' 打头（默认值：null）
* [自定义 cdn 拷贝规则](setting.cdn.js)，可使用以下高级拷贝规则：
  - a/<b\/>c.js => a/c.js（省缺 b 目录）
  - a/b.js|c.js => a/c.js（重命名为 c.js）
  - a/<b\/c/>d.js|i.js => a/i.js（省缺 b/c 目录并重命名为 i.js）
  - a/c => a/c/**/*（拷贝 a/c 目录下的所有文件）
  - a/<b\/><c/>d.js => Error（省缺目录行为只能出现一次）
  - a|b/c.js => Error（重命名规则必须在最后）