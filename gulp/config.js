var conf = {};
conf.src = "./src";
conf.dest = "./target";
conf.release = "./dist";
conf.jsDestFileName = "ui-router-menu";
conf.bower = "bower_components";

conf.jsSrc = function () {
    return conf.src + "/**/*.js";
};

conf.jsDevFile = function () {
    return conf.jsDestFileName + ".js"
};
conf.jsProdFile = function () {
    return conf.jsDestFileName + ".min.js"
};

conf.test = {};
conf.test.path = "test";
conf.test.files = [
    "../" + conf.bower + '/angular/angular.js',
    "../" + conf.bower + '/angular-mocks/angular-mocks.js',
    "../" + conf.bower + '/angular-ui-router/release/angular-ui-router.js',
    "../" + conf.dest + "/" + conf.jsProdFile(),
    "../" + conf.test.path + '/**/*.js'
];
conf.test.karmaConf = __dirname + "/karma.conf.js";

module.exports = conf;