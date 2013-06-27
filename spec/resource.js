var fs = require('fs')
  , path = require('path')

  , rootPath = __dirname.split('/').slice(0, -1).join('/')
  , bodyStartRegex = /<body( [^>]+| +)?>/i
  , bodyEndRegex = /<\/body>/i;

exports = module.exports = {
  
  ejs: function (templatePath) {

    var templatePath = path.join(rootPath, templatePath)
      , template = fs.readFileSync(templatePath).toString()
      , bodyStart = template.search(bodyStartRegex)
      , bodyEnd = template.search(bodyEndRegex);

    // Load body
    if (bodyStart === -1 || bodyEnd === -1) {
      throw new Error('Could not find <body></body>');
    } else {
      bodyEnd += template.match(bodyEndRegex)[0].length
      return template.substring(bodyStart, bodyEnd);
    }

  },

  jquery: function () {
    var jqueryPath = path.join(rootPath, 
      'node_modules/jquery-browser/lib/jquery.js');
    return fs.readFileSync(jqueryPath).toString();
  }

};
