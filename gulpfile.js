var gulp = require('gulp'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    coveralls = require('gulp-coveralls'),
    cp = require('child_process');

gulp.task('clean', function () {
    return gulp.src(['target/'])
        .pipe(clean());
});

gulp.task('lint', function () {
    return gulp.src(['src/**/*.js', 'test/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
})

gulp.task('docs', function (cb) {
    cp.exec('node node_modules/yuidocjs/lib/cli.js ./lib/ -o target/docs', cb);
});

gulp.task('copy-tests', ['clean', 'lint'], function () {
    return gulp.src(['test/**/*'])
        .pipe(gulp.dest('target/test/'));
});

gulp.task('pre-unit', ['copy-tests'], function () {
    return gulp.src(['src/**/*.js'])
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(gulp.dest('target/src/'));
});

gulp.task('unit', ['pre-unit'], function () {
    return gulp.src(['target/test/unit/**/*.js'], { read: false })
        .pipe(mocha())
        .pipe(istanbul.writeReports({
            dir: './target/coverage',
            reporters: ['lcov'],
            reportOpts: {
                dir: './target/coverage'
            }
        }));
});

gulp.task('publish-unit-coverage', ['unit'], function () {
    return gulp.src('target/coverage/lcov.info')
        .pipe(coveralls());
});

gulp.task('test', ['publish-unit-coverage']);

gulp.task('default', ['test', 'docs'], function() {
    // place code for your default task here
});