import {minify} from 'uglify-es';
import through2 from 'through2';
import gutil from 'gulp-util';

export default () => {
  return through2.obj((file, enc, cb) => {
    if(file.isBuffer()){
      const content = minify(file.contents.toString(), {
        toplevel: true,
      }).code;
      file.contents = Buffer.from(content);
      file.path = gutil.replaceExtension(file.path, '.js');
    }
    cb(null, file);
  });
};