var reload          = require('gulp-livereload')


module.exports = (gulp, $config) => () => {

  var livereload = $config('livereload')
  reload.listen(livereload.port)

  var watch = $config('path')

  //-- Runs live-reload if css, html, js or a server side view change
  // console.log('watch reload', watch.livereload)
  gulp.watch(watch.livereload).on('change', reload.changed)

  gulp.watch(watch.less, ['less'])

  gulp.watch(watch.browserify, ['browserify'])

  // gulp.watch(watch.lint, ['lint'])
}
