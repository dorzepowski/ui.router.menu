const conf = require("./gulp/config");
const gulp = require("gulp");
const concat = require("gulp-concat");
const babel = require('gulp-babel');
const del = require('del');
const watch = require('gulp-watch');
const print = require('gulp-print');
const strip = require('gulp-strip-comments');
const ngAnotate = require('gulp-ng-annotate');
const uglify = require('gulp-uglify');
const webserver = require('gulp-webserver');
const karma = require('karma').Server;

gulp.task('clean', function () {
    return del([conf.dest], {dot: true});
});

gulp.task("build:dev", function(){
   return gulp.src(conf.jsSrc())
       .pipe(concat(conf.jsDevFile()))
       .pipe(strip())
       .pipe(gulp.dest(conf.dest));
});

gulp.task("build:prod", function () {
    return gulp.src(conf.jsSrc())
        .pipe(concat(conf.jsProdFile()))
        .pipe(ngAnotate())
        .pipe(uglify())
        .pipe(gulp.dest(conf.dest));
});

gulp.task("build", ["build:prod", "build:dev"]);

gulp.task("release", ["test"], function () {
    gulp.src(conf.dest + "/**/*").pipe(gulp.dest(conf.release));
});

gulp.task("watch", function(){
    var watcher = gulp.watch(conf.jsSrc(), ["build"]);
    watcher.on("add", logModified);
    watcher.on("change", logModified);
    watcher.on("delete", logModified);


    function logModified(event) {
        console.info("File (" + event.path + ") " + event.type + " -> rebuilding");
    }
});


gulp.task('serve', function () {
    gulp.src(conf.dest)
        .pipe(webserver({
            port: '20000'
        }));
});


gulp.task("start", ["build", "serve", "watch"]);


gulp.task("test", ["build"], function (done) {
    new karma({
        configFile: conf.test.karmaConf,
        singleRun: true
    }, done).start();
});

gulp.task('tdd', ["build", "watch"], function (done) {
    new karma({
        configFile: conf.test.karmaConf,
        browsers: ['PhantomJS']
    }, done).start();
});