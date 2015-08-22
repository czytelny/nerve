// karma.conf.js
module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
        files: [
            'nerve.js',
            'spec/tests.js'
        ]
    });
};