var nodemon = require('nodemon')


module.exports = (gulp, $config) => function(opts, callback) {

  nodemon($config('config'))
    .on('start', function () {
      gulp.$time('nodemon','app started')
    })
    .on('restart', function (files) {
      gulp.$time('nodemon','changes ', files)
    })
    .on('crash', function () {
      gulp.$time('nodemon', 'app crashed')
    })
    // .on('message', function (event) {
    //   console.log('event', event)
    // })
    // }).on('quit', function () {
    //   console.log('App has quit');

}
