import copy from './copy';
import setting from './setting';

export default async (cb) => {
  const cdn = setting.cdn;
  cdn && cdn.length && await copy(cdn);
  cb();
};