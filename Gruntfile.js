module.exports = function (grunt) {
    var props = grunt.file.readJSON('build/build.properties.json');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        buildnumber: {
		    package : {}
		},
        copy: {
            main: {
                src: props.dir.src + '/wrapper.js', 
                dest: props.dir.dist + '/' + props.names.dist
            }
        },
        'string-replace': {
            main: {
                files: [{
                    src: props.dir.dist + '/' + props.names.dist,
                    dest: props.dir.dist + '/' + props.names.dist
                }],
                options: {
                    replacements: [{
                        pattern: '//::LICENSE:://',
                        replacement: grunt.file.read(props.dir.src + '/license.txt')
                    },
                    {
                        pattern: '//::SIGNAL_BINDING_JS:://',
                        replacement: grunt.file.read(props.dir.src + '/SignalBinding.js')
                    },
                    {
                        pattern: '//::SIGNAL_JS:://',
                        replacement: grunt.file.read(props.dir.src + '/Signal.js')
                    },
                    // version number, build number/date should come after other replaces
                    {
                        pattern: '\'::VERSION_NUMBER::\'',
                        replacement: '\'<%= pkg.version %>\''
                    },
                    {
                        pattern: '::BUILD_NUMBER::',
                        replacement: '<%= pkg.build %>'
                    },
                    {
                        pattern: '::BUILD_DATE::',
                        replacement: grunt.template.today("yyyy/MM/dd hh:mm TT")
                    }]
                }
            }
        },
        'closure-compiler': {
            frontend: {
                js: props.dir.dist + '/' + props.names.dist,
                jsOutputFile: props.dir.dist + '/' + props.names.dist_min,
                options: {
                    compilation_level: 'SIMPLE',
                    externs: [
                      'externs.js'
                    ]
                }
            }
        },
        jshint: {
            files: [ props.dir.dist + '/' + props.names.dist ]
        },
        jsdoc : {
            dist : {
                src: [ props.dir.src + '/Signal*.js' ],
                options: {
                    destination: "<%= pkg.directories.doc %>",
                    template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
           			configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-build-number');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('build', ['compile', 'jsdoc', 'closure-compiler']);

    grunt.registerTask('compile-done', function(){
        grunt.log.writeln('%s built.', props.names.dist);
        grunt.log.writeln('Build complete.', props.names.dist);
    });

    grunt.registerTask('build-done', function(){
        grunt.log.writeln('Build complete.', props.names.dist);
    });

    grunt.registerTask('compile', function(){
        grunt.log.writeln('Building %s..', props.names.dist);
        grunt.task.run(['buildnumber', 'copy:main', 'string-replace:main', 'compile-done']);
    } );
    
};