module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    // Task configuration.

    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: '.jshintrc'
      },
      src: {
        src: ['lib/**/*.js', 'index.js', 'gruntfile.js']
      },
      tests: {
        src: ['tests/**/*.js']
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec',
        require: [
        ]
      },
      src: ['<%= jshint.tests.src %>']
    },

    env: {
      test: {
        NODE_ENV: 'test'
      }
    },

    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['test', 'jshint:src']
      },
      tests: {
        files: '<%= jshint.tests.src %>',
        tasks: ['test', 'jshint:tests']
      }
    }
  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, {});

  // Full testing task
  grunt.registerTask('test', ['env:test', 'mochaTest']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'watch']);

};
