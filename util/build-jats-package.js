var glob = require('glob');
var path = require('path');
var fs = require('fs');

var basedir = path.join(__dirname, '..', 'packages', 'jats');

glob(path.join(basedir, '/*/*.scss'), function(_, files) {
  var imports = files.map(function(file) {
    var name = path.basename(file, '.scss');
    return '@import "./' + name.substring(1) + '/' + name+'";';
  });
  imports.unshift('// ATTENTION: this file has been generated automatically using `util/build-jats-package`.');
  fs.writeFileSync(path.join(basedir, '_all.scss'), imports.join("\n"));
});
