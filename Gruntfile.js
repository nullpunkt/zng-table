module.exports = function(grunt) {
    grunt.initConfig({
        html2js: {
            options: {
                singleModule: true,
                indentString: '',
                module: 'zng.table.templates',
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            main: {
                src: ['src/template/**/*.html'],
                dest: 'tmp/templates.js'
            }
        },
        uglify: {
            my_target: {
                files: {
                    'build/zng-table.min.js': ['tmp/templates.js', 'tmp/zng-table.js']
                }
            }
        },
        replace: {
            zngtable: {
                src: ['src/js/zng-table.js'],
                dest: 'tmp/',
                replacements: [{
                    from: "angular.module('zng.table', [])",
                    to: "angular.module('zng.table', ['zng.table.templates'])"
                }]
            }
        },
        clean: ['tmp']
    });

    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['html2js', 'replace', 'uglify', 'clean']);
    grunt.registerTask('debug', ['html2js', 'replace']);
};
//match: "angular.module('zng.table', [])",
//    replacement: "angular.module('zng.table', ['zng.table.templates'])"