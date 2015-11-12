module.exports = function(gulp, cfg) {

  var utils    = require('./_util')
  gulp.util    = require('gulp-util')


  global.cmd   = process.argv[2] || 'default'
  if (cmd == 'dist') cfg.log = Object.assign(cfg.log||{},{time:true,config:true})

  Object.assign(gulp, utils.Instrument(gulp, gulp.util.colors, cfg))

  var build = {}
  build.plumber = utils.Plumber(gulp, cfg, gulp.$wire)
  build.configure = (configFns) => {
    for (var section in configFns)
      if (cfg[section])
        Object.assign(cfg[section],configFns[section](cfg[section]))
    return build
  }
  build.run = function run() {
    try {
      gulp.$time('run', cmd)
      return build.plumber.wireTask(cmd)
    } catch (e) {
      gulp.$done(`Run failed for cmd: ${cmd}`)(e)
    }
  }

  return build

}


//-- TO look into:
// https://github.com/gulpjs/gulp/tree/master/docs/recipes
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/incremental-builds-with-concatenate.md
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/automate-release-workflow.md
// https://github.com/gu`lpjs/gulp/blob/master/docs/recipes/pass-arguments-from-cli.md
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
