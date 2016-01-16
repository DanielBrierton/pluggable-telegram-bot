var gulp = require('gulp'),
    cp = require('child_process');

gulp.task('docs', function (cb) {
    cp.exec('node node_modules/yuidocjs/lib/cli.js ./lib/ -o docs', cb);
});

gulp.task('default', ['docs'], function() {
    // place code for your default task here
});