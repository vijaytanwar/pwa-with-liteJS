/**
 * Grunt config file
 */

'use strict';

var packageJson = require('./package.json');
var path = require('path');
var swPrecache = require('./node_modules/sw-precache/lib/sw-precache.js');

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        swPrecache: {
            dev: {
                //for development purpose set it false, otherwise it will load all files from cache
                handleFetch: false,
                rootDir: './'
            },
            prod: {
                //for development purpose set it false, otherwise it will load all files from cache
                handleFetch: true,
                rootDir: './'
            }
        },
        concat: {
            options: {
                separator: '\n',
            },
            //pre-build
            material: {
                src: [
                    'node_modules/materialize-css/js/velocity.min.js',
                    'node_modules/materialize-css/js/hammer.min.js',
                    'node_modules/materialize-css/js/jquery.hammer.js',
                    'node_modules/materialize-css/js/jquery.easing.1.4.js',
                    'node_modules/materialize-css/js/initial.js',
                    'node_modules/materialize-css/js/global.js',
                    'node_modules/materialize-css/js/materialbox.js',
                    'node_modules/materialize-css/js/transitions.js',
                    'node_modules/materialize-css/js/animation.js',
                    'node_modules/materialize-css/js/collapsible.js',
                    'node_modules/materialize-css/js/sideNav.js',
                    'node_modules/materialize-css/js/modal.js',
                    'node_modules/materialize-css/js/forms.js',
                ],
                dest: 'app/vendors/material.js',
            },
            vendors: {
                src: [
                    'app/vendors/jquery-2.1.1.min.js',
                    'app/vendors/handlebars.min.js',
                    'app/vendors/material.js',
                    'app/vendors/liteJS.js',
                ],
                dest: 'js/vendors.js',
            },
            app: {
                src: ['app/js/**/*.js'],
                dest: 'js/index.js',
            }
        },
        sass: {
            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'css/index.css': 'app/sass/index.scss'
                }
            },
            prod: {
                options: {
                    sourcemap: 'none'
                },
                files: {
                    'css/tmp_index.css': 'app/sass/index.scss'
                }
            }
        },
        handlebars: {
            dev: {
                options: {
                    namespace: 'templates',
                    processName: generateTemplateName
                },
                files: {
                    'js/templates.js': ['app/js/**/*.html']
                }
            },
            prod: {
                options: {
                    namespace: 'templates',
                    processName: generateTemplateName
                },
                files: {
                    'js/tmp_templates.js': ['app/js/**/*.html']
                }
            }
        },
        watch: {
            js: {
                files: ['app/js/**/*.js'],
                tasks: ['concat:vendors', 'concat:app']
            },
            templates: {
                files: ['app/js/**/*.html'],
                tasks: ['handlebars']
            },
            sass: {
                files: ['app/**/*.scss'],
                tasks: ['sass']
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
                mangle: {
                    reserved: ['jQuery']
                },
                beautify: false
            },
            vendors: {
                files: {
                    'js/vendors.js': [
                        'app/vendors/jquery-2.1.1.min.js',
                        'app/vendors/handlebars.min.js',
                        'app/vendors/material.js',
                        'app/vendors/liteJS.js',
                    ]
                }
            },
            app: {
                files: {
                    'js/index.js': ['app/js/**/*.js'],
                    'js/templates.js': ['js/tmp_templates.js']
                }
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: true,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'css/index.css': ['css/tmp_index.css']
                }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        src: ['index.html', 'todo-app-sw.js', 'manifest.json', 'fonts/*', 'images/*', 'css/*', 'js/*'],
                        dest: 'public/',
                        filter: 'isFile'
                    },
                ]
            },
        },
        clean: {
            build: ['public', 'css/tmp_index.css', 'js/tmp_templates.js'],
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerMultiTask('swPrecache', function () {
        /* eslint-disable no-invalid-this */
        var done = this.async();
        var rootDir = this.data.rootDir;
        var handleFetch = this.data.handleFetch;
        /* eslint-enable */

        writeServiceWorkerFile(rootDir, handleFetch, function (error) {
            if (error) {
                grunt.fail.warn(error);
            }
            done();
        });
    });
    function generateTemplateName(filePath) {
        var pieces = filePath.split('/');
        return pieces[pieces.length - 1].split(".")[0];
    }
    function writeServiceWorkerFile(rootDir, handleFetch, callback) {
        var config = {
            cacheId: packageJson.name,
            // If handleFetch is false (i.e. because this is called from swPrecache:dev), then
            // the service worker will precache resources but won't actually serve them.
            // This allows you to test precaching behavior without worry about the cache preventing your
            // local changes from being picked up during the development cycle.
            handleFetch: handleFetch,
            logger: grunt.log.writeln,
            staticFileGlobs: [
                rootDir + 'index.html',
                rootDir + 'js/**.js',
                rootDir + 'css/**.css',
                rootDir + 'images/**.*',
                rootDir + 'fonts/**.*',
            ],
            stripPrefix: rootDir + '/',
            // verbose defaults to false, but for the purposes of this demo, log more.
            verbose: true
        };

        swPrecache.write(path.join(rootDir, 'todo-app-sw.js'), config, callback);
    }

    //build material
    grunt.registerTask('material', ['concat:material']);

    //default task
    grunt.registerTask('default', ['clean','concat:vendors', 'concat:app', 'sass:dev', 'handlebars:dev', 'swPrecache:dev', 'watch']);

    //prod build
    grunt.registerTask('prod', ['handlebars:prod', 'uglify', 'sass:prod', 'cssmin', 'clean', 'swPrecache:prod', 'copy:main']);

};