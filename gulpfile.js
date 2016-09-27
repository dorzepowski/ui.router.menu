var conf = {
    src: "./src",
    dest: "./dist",
    jsSrc : function () {
        return this.src + "/**/*.js";
    },
    jsDest: "ui-router-menu-extension",
    jsDevFile: function () {
        return this.jsDest + ".js"
    },
    jsProdFile: function () {
        return this.jsDest + ".min.js"
    }
};

const gulp = require("gulp");
const concat = require("gulp-concat");
const babel = require('gulp-babel');
const del = require('del');
const watch = require('gulp-watch');
const print = require('gulp-print');
const strip = require('gulp-strip-comments');
const uglify = require('gulp-uglify');
const webserver = require('gulp-webserver');

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
        .pipe(uglify())
        .pipe(gulp.dest(conf.dest));
});

gulp.task("watch", function(){
    var watcher = gulp.watch(conf.jsSrc(), ["build:dev", "build:prod"]);
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


gulp.task("start", ["build:dev", "build:prod", "serve", "watch"]);