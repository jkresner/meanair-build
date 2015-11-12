var less           = require('gulp-less')
var watch          = require('gulp-watch')

module.exports = (gulp, $config) => function(callback) {

  gulp
    .src($config('src'))
    .pipe(less({paths:$config('imports')}))
    .on('error', gulp.$error('LESS', callback))
    .pipe(gulp.dest($config('dest')))
    .on('end', callback)

}
