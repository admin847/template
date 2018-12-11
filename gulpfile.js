'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const del = require('del');
const browserSync = require('browser-sync').create();

const path = {
  build: {
    html: 'build/',
    js: 'build/assets/js/',
    css: 'build/assets/css/',
    img: 'build/assets/img/',
    fonts: 'build/assets/fonts/'
  },
  src: {
    html: (['src/pug/*.pug', '!src/pug/_*.pug']),
    js: 'src/assets/js/main.js',
    styles: 'src/assets/styles/main.sass',
    img: 'src/assets/img/**/*.*',
    fonts: 'src/assets/fonts/**/*.*'
  },
  watch: {
    html: 'src/pug/**/*.pug',
    js: 'src/assets/js/**/*.js',
    styles: 'src/assets/styles/**/*.sass',
    img: 'src/assets/img/**/*.*',
    fonts: 'src/assets/fonts/**/*.*'
  },
  clean: './build'
};

function html() {
  return gulp.src(path.src.html)
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.reload({
      stream: true
    }))
}

function styles() {
  return gulp.src(path.src.styles)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 0.1%'],
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream({
      stream: true
    }));
}

function scripts() {
  return gulp.src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(uglify({
      toplevel: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
}

function images() {
  return gulp.src(path.src.img)
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imageminJpegRecompress({
        loops: 5,
        min: 65,
        max: 70,
        quality: 'medium'
      }),
      imagemin.svgo(),
      imagemin.optipng({
        optimizationLevel: 3
      }),
      pngquant({
        quality: '65-70',
        speed: 5
      })
    ], {
      verbose: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(browserSync.stream());
}

function fonts() {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(browserSync.stream());
}


function clean() {
  return del([path.clean]);
}

function watch() {
  browserSync.init({
    server: {
      baseDir: path.clean
    }
  });
  gulp.watch(path.watch.html, html, browserSync.reload);
  gulp.watch(path.watch.styles, styles);
  gulp.watch(path.watch.js, scripts);
  gulp.watch(path.watch.img, images);
  gulp.watch(path.watch.fonts, fonts);
}


gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('images', images);
gulp.task('watch', watch);
gulp.task('clean', clean);

gulp.task('build', gulp.series(clean,
  gulp.parallel(html, styles, scripts, images, fonts)
));