# [@vope/template](https://github.com/702017364/vepo-template.git)

## AD
* 开发环境下开启 web 服务器
* 支持代理服务器
* 监听文件变化 => 编译 scss 和 js（如果有改动） => 刷新浏览器
* 启动时会根据设置自动从安装包中拷贝出 cdn
* 发布时会将所有文件整理到 dist 目录

## NPM 命令
```bash
# 运行开发环境
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
* [env](template.json)：是否开启 es5 语法编译（默认值：false）
* [entry](template.json)：是否使用 index.html 文件（默认值：true）
* [base](template.json)：服务器启动目录（默认值：'./'）
* [runtime](template.json)：是否启用默认的 transform-runtime （默认值：true）
* [output](template.json)：设置样式编译出口（多个值则代表多个出口）（默认值：'index.scss'）
* [cdn](template.json)：设置 cdn 的安装包名（默认值：[]）
* [merge](template.json)：设置需要合并的 cdn （默认值：[]）
  - '/' 打头视为从当前跟目录开始查找的相对路径
  - 其它则视为从 cdn 目录开始查找的安装包下文件的相对路径
  - 仅指定目录名的会自动指向该目录下的 index.js 文件
* [rollup](template.json)：配置 rollup（默认值...）
  - 属性 input 默认值为 'index.js'
  - 属性 output.format 默认值为 'iife'
* [presets](template.json)：设置 babel 预设（默认值：[]）
* [plugins](template.json)：设置 babel 插件（默认值：[]）
* [browsersync](template.json)：设置 browsersync（默认值：null）
  - 非空字符串代表代理目标，中间件使用默认配置，代理接口以 '/api' 打头
  - 对象类型则代表自定义设置
* [rules](template.json)：自定义 cdn 拷贝规则：
  - a/<b\/>c.js => a/c.js（省缺 b 目录）
  - a/b.js|c.js => a/c.js（重命名为 c.js）
  - a/<b\/c/>d.js|i.js => a/i.js（省缺 b/c 目录并重命名为 i.js）
  - a/c => a/c/**/*（拷贝 a/c 目录下的所有文件）
  - a/<b\/><c/>d.js => Error（省缺目录行为只能出现一次）
  - a|b/c.js => Error（重命名规则必须在最后）