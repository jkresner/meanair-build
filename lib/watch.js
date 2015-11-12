var reload          = require('gulp-livereload')


module.exports = (gulp, $config) => () => {

  var livereload = $config('livereload')
  reload.listen(livereload.port)

  var watch = $config('path')

  //-- Runs live-reload if css, html, js or a server side view change
  gulp.$time('watch.reload', watch.livereload)
  gulp.watch(watch.livereload).on('change', reload.changed)

  gulp.$time('watch.less', watch.less)
  gulp.watch(watch.less, ['less'])

  gulp.$time('watch.browserify', watch.browserify)
  gulp.watch(watch.browserify, ['browserify'])

  // gulp.watch(watch.lint, ['lint'])
}
