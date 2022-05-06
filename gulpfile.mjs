/* eslint-disable require-jsdoc */
'use strict';

import del from "del";
import gulp from "gulp";
import htmlmin from "gulp-htmlmin";
import uglify from "gulp-uglify";
import CleanCSS from "clean-css";
import concat from "gulp-concat";
import image from 'gulp-image';
import browserSync from 'browser-sync';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10',
];

function js(cb) {
  return gulp.src('src/js/**/*.js')
  // The gulp-uglify plugin won't update the filename
      .pipe(uglify())
      .pipe(gulp.dest('docs/js'))
      .pipe(browserSync.stream());
}

// Gulp task to minify CSS files
function css() {
  const options = {
      compatibility: '*', // (default) - Internet Explorer 10+ compatibility mode
      inline: ['all'], // enables all inlining, same as ['local', 'remote']
      level: 2 // Optimization levels. The level option can be either 0, 1 (default), or 2, e.g.
      // Please note that level 1 optimization options are generally safe while level 2 optimizations should be safe for most users.
  };

  return gulp.src('src/css/*.css')
      .pipe(concat('main.css'))
      .on('data', function(file) {
        const buferFile = new CleanCSS(options).minify(file.contents);
        return file.contents = Buffer.from(buferFile.styles);
      })
      .pipe(gulp.dest('docs/css'))
      .pipe(browserSync.stream());
}

// Gulp task to minify HTML files
function html(cb) {
  return gulp.src(['./src/**/*.html'])
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      }))
      .pipe(gulp.dest('docs'))
      .pipe(browserSync.stream());
}

function images(cb) {
  return gulp.src('src/images/**')
  .pipe(image())
  .pipe(gulp.dest('docs/images'))
  .pipe(browserSync.stream());
}

async function webpImages() {
  const outputFolder = 'docs/images/';

	await imagemin(['docs/images/*.png'], {
    destination: outputFolder,
    plugins: [
      imageminWebp({
        lossless: true
      })
    ]
  })
  console.log('PNGs processed')
  await imagemin(['docs/images/*.{jpg,jpeg}'], {
    destination: outputFolder,
    plugins: [
      imageminWebp({
        quality: 60
      })
    ]
  })
  console.log('JPGs and JPEGs processed')
}

// Clean output directory
function clean(cb) {
  del('docs');
  cb();
}

export function serve(cb) {
  browserSync.init({
      server: {
          baseDir: "./docs/"
      }
  });

  gulp.watch("src/*.html").on('change', html);
  gulp.watch("src/images/**").on('change', images);
  gulp.watch("src/js/*.js").on('change', js);
  gulp.watch("src/css/*.css").on('change', css);
}

export default gulp.series(gulp.parallel(html, css, js, images), webpImages);
