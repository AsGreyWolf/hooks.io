"use strict";
var gulp = require("gulp");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var minify_css = require("gulp-minify-css");
var autoprefixer = require("gulp-autoprefixer");
var html_minify = require("gulp-htmlmin");
var uglify = require("gulp-uglify");
var exec = require('child_process').exec,
    server = require( 'gulp-develop-server' ),
     client_logic = "dev-client-scripts/*.js",
        gameFiles = "game-scripts/*.js",
        modules = "dev-client-scripts/modules/*.js",
        clientDest = "client-scripts";

gulp.task('scripts', function (){
  console.log("Minifying scripts");
  return gulp.src([modules,client_logic,gameFiles])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(clientDest))
});

gulp.task('default', function (cb) {
  gulp.run('scripts');
  server.listen( { path: './server.js' } );
});