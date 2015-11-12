module.exports = (gulp, $config) =>

  function(callback) {
    var merge         = require('merge-stream'),
        rev           = require('gulp-rev')

    var source        = require('vinyl-source-stream2'),
        buffer        = require('gulp-buffer'),
        uglify        = require('gulp-uglify')

    var less          = require('gulp-less'),
        minifyCSS     = require('gulp-minify-css')

    $config.browserify = gulp.$config('browserify')
    $config.less = gulp.$config('less')

    var base = $config('src')
    var dest = $config('dest')

    merge(

      require('./browserify')(gulp, $config.browserify)(()=>{})
        .pipe(buffer())                 // Used because something doesnt support streams
        .pipe(uglify())
      ,

      gulp.src($config.less('src'), {base})
        .pipe(less({paths:$config.less('imports')}))
        .pipe(minifyCSS({}))
        .on('end', function() { gulp.$time('lessed! ') })
    )
      .pipe(rev())
      .pipe(gulp.dest(dest))
      .pipe(rev.manifest(`${dest}/rev-manifest.json`,{merge:true}))
      .pipe(gulp.dest('./'))
      .on('end', callback)
  }

