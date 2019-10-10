import setting from './setting';

const modules = ({
  amd: '@babel/plugin-transform-modules-amd',
  commonjs: '@babel/plugin-transform-modules-commonjs',
  systemjs: '@babel/plugin-transform-modules-systemjs',
  umd: '@babel/plugin-transform-modules-umd',
})[setting.import];

const builts = [
  [ '@babel/plugin-proposal-class-properties', { loose: true } ],
  [ '@babel/plugin-proposal-private-methods', { loose: true } ],
  '@babel/plugin-proposal-function-bind',
  '@babel/plugin-proposal-logical-assignment-operators',
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-proposal-optional-chaining',
  '@babel/plugin-proposal-partial-application',
  '@babel/plugin-proposal-throw-expressions',
  [ '@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' } ],
];

modules && builts.push(modules);

export default do{
  const { 
    babelcli, 
    flag,
  } = setting;
  const cli = Array.isArray(babelcli) ? babelcli : [];
  let list;
  if(flag == 'r'){
    list = [...builts, ...cli];
  } else if(flag == 'w'){
    list = [...cli];
  } else if(typeof flag == 'function'){
    list = flag([...builts]);
  } else{
    list = [...builts];
  }
  list;
};