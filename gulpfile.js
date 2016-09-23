var conf = {
    src: "./src",
    dest: "./dist",
    jsSrc : function () {
        return this.src + "/**/*.js";
    },
    jsDest: "ui-router-menu-extension",
    jsDevFile: function () {
        return this.jsDest + ".js"
    }
};

const gulp = require("gulp");
const concat = require("gulp-concat");
const babel = require('gulp-babel');
const del = require('del');
const watch = require('gulp-watch');
const print = require('gulp-print');

gulp.task('clean', function () {
    return del([conf.dest], {dot: true});
});

gulp.task("build:dev", function(){
   return gulp.src(conf.jsSrc())
       .pipe(concat(conf.jsDevFile()))
       .pipe(gulp.dest(conf.dest));
});

gulp.task("watch", function(){
    gulp.watch(conf.jsSrc(), function(file){
        gulp.src(file.path)
            .pipe(print(modified));
        gulp.run("build:dev")
    });
});

function modified(file) {
    return "File (" + file + ") modified -> rebuilding";
}