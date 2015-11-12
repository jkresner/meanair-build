var del = require('del')

module.exports = (gulp, $config) => function() {

  return del($config('dirs'))

}
