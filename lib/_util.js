var start = new Date().getTime()

module.exports.Instrument = (gulp, colors, cfg) => ({
  $time() {
    if (cfg.log.times) {
      var lapsed = new Date().getTime() - start
      var args = [].slice.call(arguments)
      args.unshift(colors.white(`${lapsed} >>`))
      args[1] = colors.white(args[1])+'\t'
      gulp.util.log.apply(this, args)
    }
  },
  $wire(step, name) {
    if (cfg.log.wire) gulp.$time(step, colors.cyan(name))
  },
  $done(name, cb) {
    return function(e) {
      if (!e) gulp.util.log(colors.green(done), colors.cyan(name))
      else {
        gulp.util.beep()
        gulp.util.log(colors.white(name.toUpperCase()), colors.red(e.message))
      }
      if (cb) cb()
    }
  },
  $config(sectionName) {
    var section = cfg[sectionName]
    return function(attr) {
      var val = section[attr]
      if (cfg.log.config) {
        var isObj = val.constructor === Object
        gulp.util.log(colors.gray('cfg'), colors.cyan(`${sectionName}.${attr}`)+'\t',
                      colors.gray(isObj ? JSON.stringify(val) : val))
      }
      return val
    }
  }
})


module.exports.Plumber = (gulp, cfg, $wire) => ({
  dependencies(list) {
    list.forEach(name=>this.wireTask(name))
    return list
  },
  wireTask(name) {
    $wire('init', name)
    if (name == 'default')
      return gulp.task(name, this.dependencies(cfg.default))

    var path         = require('path').join(__dirname, name)
    var task         = null
    try {
      var task = require(path)(gulp, gulp.$config(name))
    } catch (e) {
      $wire('failed', `Require: ${path}`)
      throw e
    }

    var simple       = ['lint','clean','less','browserify','nodemon'].indexOf(name) != -1
    if (simple) {
      gulp.task(name, function(cb) {
        $wire('start', name)
        task(function() {
          $wire('done', name)
          cb.apply(this, arguments)
        })
      })
    }
    else if (name == 'watch') {
      var dependencies = this.dependencies(['less','browserify'])
      gulp.task('watch', function(cb) {
        $wire('start', name)
        task()
      })
    } else if (name == 'dist') {
      gulp.task('dist', function(cb) {
        $wire('start', name)
        task(function() {
          $wire('done', name)
          return cb.apply(this, arguments)
        })
      })
    }
  }
})
