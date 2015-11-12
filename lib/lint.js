var jshint = require('gulp-jshint')
var watch = require('gulp-watch')

module.exports = (gulp, $config) => (callback) =>

  gulp.src($config('path'))
    .pipe(jshint($config('config')))
    .pipe(jshint.reporter('default', callback))


