var root = __dirname.substr(0, __dirname.lastIndexOf('/'))
  , resource = {}
  , paths = {
        io  : '/node_modules/socket.io-client/dist/socket.io.js',
        js  : '/web/resource/js'
    };

function cleanfile (s) {
    return (s[0] !== '/' ? '/' : '') + s;
}

for (key in paths) {
    resource[key] = function (key, file) {
        return root + paths[key] + (file ? cleanfile(file) : '');
    }.bind(null, key);
}

exports = module.exports = resource;