var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    cp = require('child_process');

gulp.task('docs', function (cb) {
    cp.exec('node node_modules/yuidocjs/lib/cli.js ./lib/ -o docs', cb);
});

gulp.task('unit', function () {
    return gulp.src(['test/unit/**/*.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec'
        }));
});

gulp.task('test', ['unit']);

gulp.task('default', ['test', 'docs'], function() {
    // place code for your default task here
});