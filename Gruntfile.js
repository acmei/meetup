module.exports = function(grunt) {
  grunt.initConfig({
    wiredep: {
      sass: {
        src: ["components/sassquatch2/sass/_util.scss"],
        options: {
          exclude: ['sassquatch.scss']
        }
      }
    },
    sass: {
      dist: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed'
        },
        files: {
          'dist/sassquatch.css': 'components/sassquatch2/sass/sassquatch.scss',
          'dist/style.css': 'src/style.scss'
        }
      }
    },
    watch: {
      sass: {
        files: 'src/*.scss',
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['wiredep', 'sass', 'watch']);
};
