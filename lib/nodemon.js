var nodemon = require('nodemon')
var domain = require('domain')
var wrap = function(nodemoninstance) {
  var domon = domain.create()
  domon.active = domon
  domon.add(nodemoninstance)
  domon.on('error', function(err) {
    console.log('nodemon carked it again...')
    console.log('existing so we dont hang...')
    process.exit(1)
  })
  domon.run(()=>{})
  return nodemoninstance
}


module.exports = (gulp, $config) => function(opts, callback) {

  wrap(nodemon($config('config')))
    .on('start', function () {
      gulp.$time('nodemon','app started')
    })
    .on('restart', function (files) {
      console.log('nodemon','changes ', files)
    })
    .on('crash', function () {
      console.log('nodemon', 'App crashed. Change a watched file if the process seems stuck.')
    })
    .on('message', function (event) {
      console.log('event', event)
    })
    .on('quit', function () {
      console.log('App has quit')
    })

}
