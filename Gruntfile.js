module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          sourceMap: false,
          outputStyle: 'expanded'
        },
        files: {
          "dist/sassquatch.css": "bower_components/sassquatch2/sass/sassquatch.scss",
          "dist/style.css": "src/style.scss"
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
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
};
