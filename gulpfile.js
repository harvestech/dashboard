var gulp = require('gulp');

const htmlPartial = require('gulp-html-partial');

var sass = require("gulp-sass"), // переводит SASS в CSS
    cssnano = require("gulp-cssnano"), // Минимизация CSS
    autoprefixer = require('gulp-autoprefixer'), // Проставлет вендорные префиксы в CSS для поддержки старых браузеров
    imagemin = require('gulp-imagemin'), // Сжатие изображение
    concat = require("gulp-concat"), // Объединение файлов - конкатенация
    uglify = require("gulp-uglify"), // Минимизация javascript
    rename = require("gulp-rename"), // Переименование файлов
    path = require('path'),
    sourcemaps = require('gulp-sourcemaps'),
    open = require('gulp-open'),
    rigger = require('gulp-rigger'),
    addsrc = require('gulp-add-src'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS = require('gulp-minify-css');

var Paths = {
  HERE: './',
  DIST: 'dist/css/',
  CSS: './src/css/',
  SCSS_TOOLKIT_SOURCES: './src/scss/paper-dashboard.scss',
  SCSS: './src/scss/**/**'
};

// Копирование файлов HTML в папку dist
gulp.task("html", function() {
  return gulp.src("src/html/views/*.html")
  .pipe(htmlPartial({
    basePath: 'src/html/includes/'
  }))
  .pipe(gulp.dest("dist"));
});

// Копирование файлов demo в папку dist
gulp.task("fonts", function() {
  return gulp.src("src/fonts/*.*")
  .pipe(gulp.dest("dist/fonts"));
});

// Копирование файлов demo в папку dist
gulp.task("demo", function() {
  return gulp.src("src/demo/*.*")
  .pipe(gulp.dest("dist/demo"));
});

// CSS & Less
gulp.task('css', function(){
  gulp.src('src/css/bootstrap.min.css')
      .pipe(addsrc.append('src/css/paper-dashboard.min.css'))
      .pipe(addsrc.append('src/css/font-awesome.min.css'))
      .pipe(concat('style.css'))
      .pipe(minifyCSS())
      .pipe(rename({ suffix: '.min' })) 
      .pipe(gulp.dest('dist/css'));
});

gulp.task('compile-scss', function() {
  return gulp.src(Paths.SCSS_TOOLKIT_SOURCES)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(Paths.HERE))
    .pipe(gulp.dest(Paths.DIST));
});

gulp.task('scripts', function() {
  gulp.src('src/js/core/jquery.min.js')
    .pipe(addsrc.append('src/js/core/popper.min.js'))
    .pipe(addsrc.append('src/js/core/bootstrap.min.js'))
    .pipe(addsrc.append('src/js/plugins/perfect-scrollbar.jquery.min.js'))
    .pipe(addsrc.append('src/js/plugins/chartjs.min.js'))
    .pipe(addsrc.append('src/js/plugins/bootstrap-notify.js'))
    .pipe(addsrc.append('src/js/paper-dashboard.min.js'))
    .pipe(addsrc.append('src/demo/demo.js'))
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' })) 
    .pipe(gulp.dest('dist/js'));
});

// Сжимаем картинки
gulp.task('imgs', function() {
  return gulp.src("src/img/*.+(jpg|jpeg|png|gif)")
      .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true
      }))
      .pipe(gulp.dest("dist/img"))
});

gulp.task('watch', function() {
  gulp.watch(Paths.SCSS, ['compile-scss']);
});

gulp.task('open', function() {
  gulp.src('dist/dashboard.html')
    .pipe(open());
});


gulp.task('default', ['html', 'scripts', 'compile-scss','css', 'imgs', 'fonts', 'demo']);