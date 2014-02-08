var fs = require('fs');
var path = require('path');
var jsxgettext = require('jsxgettext');
var walk = require('walk');

function extractStrings(options) {

  var walker = walk.walk(path.resolve(options['input-dir'] || ''));

  var sources = {};

  var extensions = Object.keys(options.parsers).map(function(ext) {
    return ext.replace(/\./g, '\\.');
  }).join('|');

  var nameRegex = new RegExp('(' + extensions + ')$');
  var cwd = process.cwd() + path.sep;

  walker.on('file', function(root, stats, next) {
    var fullFileName = path.join(root, stats.name);
    var fileName = fullFileName.replace(cwd, '');

    var extension = fileName.match(nameRegex);
    if (! extension || !extension[0]) return next();
    extension = extension[0];

    var contents = fs.readFileSync(fullFileName, 'utf8');
    if (extension) {
      if (! sources[options.parsers[extension]]) {
        sources[options.parsers[extension]] = {};
      }
      sources[options.parsers[extension]][fileName] = contents.toString('utf8');
    }
    next();
  });

  walker.on('end', function() {
    Object.keys(sources).forEach(function(key, i) {
      if (i > 0) options['join-existing'] = true;
      var strings,
          generator;

      if (key !== 'javascript') {
        generator = 'generateFrom' + key[0].toUpperCase() + key.slice(1).toLowerCase();
        if (! jsxgettext[generator]) throw new Error('No such jsxgettext generator: ' + key);

        strings = jsxgettext.generate.apply(jsxgettext, jsxgettext[generator](sources[key], options));
      } else {
        strings = jsxgettext.generate(sources[key], options);
      }
      fs.writeFileSync(path.resolve(options['output-dir'] || '', options.output), strings, "utf8");
    });
  });

  return walker;
}

module.exports = extractStrings;
