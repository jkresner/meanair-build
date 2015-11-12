var join            = require('path').join
var browserify      = require('browserify'),
    es6ify          = require('es6ify'),
    stringify       = require('stringify'),
    annotate        = require('browserify-ngannotate'),
    watchify        = require('watchify'),
    source          = require('vinyl-source-stream2'),
    merge           = require('merge-stream')


module.exports = (gulp, $config) => function(callback) {

  var src = $config('src')
  var watch = $config('watch')

  function bundle(fileName) {
    var bOpts = { entries: [join(src,fileName)] }
    var b = !watch ? browserify(bOpts) :
      watchify(browserify(Object.assign(bOpts, watchify.args)))

    b.transform(stringify(['.html']))
    b.transform(es6ify.configure(/^(?!.*components)+.+\.js$/))
    b.transform(annotate)

    b.rebundle = () => b.bundle()
    b.on('update', b.rebundle)
    return b.bundle()
  }

  var entries = $config('entries')

  var stream = merge(entries.map(entry =>
    bundle(entry)
      .on('error', gulp.$done('Browserify', callback))
      .pipe(source({path:`${src}/${entry}`, base: src.replace('/js','') }))
      .on('end', function() { gulp.$time('browserified: ', entry) })
  ))

  if (!$config('dist'))
    stream
      .pipe(gulp.dest($config('dest')+'/js'))
      .on('end', callback)

  return stream
}
