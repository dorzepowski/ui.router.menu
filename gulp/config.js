const PROFILE_DEV = "DEV";
const PROFILE_PROD = "PROD";

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
conf.test.files = {
    prod: testFilesList(PROFILE_PROD),
    dev: testFilesList(PROFILE_DEV)
};

conf.test.karmaConf = function (profile) {
    var confName = __dirname + "/";
    if (profile == PROFILE_PROD) {
        confName += "karma.prod.conf.js";
    } else if (profile == PROFILE_DEV) {
        confName += "karma.dev.conf.js"
    } else {
        throw "Unsupported profile " + profile;
    }
    return confName
};

module.exports = conf;

function testFilesList(profile) {
    var fileList = [
        "../" + conf.bower + '/angular/angular.js',
        "../" + conf.bower + '/angular-mocks/angular-mocks.js',
        "../" + conf.bower + '/angular-ui-router/release/angular-ui-router.js',
        "../" + conf.test.path + '/**/*.js'
    ];
    if (profile == PROFILE_PROD) {
        fileList.push("../" + conf.dest + "/" + conf.jsProdFile())
    } else {
        fileList.push("../" + conf.src + '/**/*.js');
    }
    return fileList;
}