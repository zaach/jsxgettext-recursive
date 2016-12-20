# jsxgettext-recursive

Recursively search and extract gettext strings.

## Install

    npm install jsxgettext-recursive

## Example

```
var extract = require('jsxgettext-recursive');


var walker = extract({
  'input-dir': './app/scripts',
  outputDir: './locales',
  output: 'client.pot',
  exclude: /dist/,
  joinExisting: false,
  keyword: 't',
  parsers: {
    '.js': 'javascript',
    '.mustache': 'handlebars'
  }
});

walker.on('end', function() {
  console.log('done!');
});
```

Possible parsers include: `javascript`, `handlebars`, `jade`, `ejs`, `jinja`.
