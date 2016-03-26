module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        options: {
          sourceMap: false,
          outputStyle: 'expanded'
        },
        files: {
          "stylesheets/css/sassquatch.css": "bower_components/sassquatch2/sass/sassquatch.scss",
          "stylesheets/css/style.css": "stylesheets/sass/style.scss"
        }
      }
    },
    watch: {
      sass: {
        files: 'stylesheets/sass/*.scss',
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
};
