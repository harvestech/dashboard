var gulp = require('gulp');

const htmlPartial = require('gulp-html-partial');

var sass = require("gulp-sass"), // переводит SASS в CSS
    autoprefixer = require('gulp-autoprefixer'), // Проставлет вендорные префиксы в CSS для поддержки старых браузеров
    imagemin = require('gulp-imagemin'), // Сжатие изображение
    concat = require("gulp-concat"), // Объединение файлов - конкатенация
    uglify = require("gulp-uglify"), // Минимизация javascript
    //rename = require("gulp-rename"), // Переименование файлов
    path = require('path'),
    sourcemaps = require('gulp-sourcemaps'),
    addsrc = require('gulp-add-src'),
    minifyCSS = require('gulp-minify-css'), // Минимизация css
    clean = require('gulp-clean'),
    gzip = require('gulp-gzip'),
    server = require( 'gulp-develop-server' ),
    browserSync = require( 'browser-sync' ),
    preprocess = require('gulp-preprocess'),
    watch = require('gulp-watch'),
    gutil = require('gulp-util'),
    ftp = require('vinyl-ftp'),
    purify = require('gulp-purifycss'),
    gulpsync = require('gulp-sync')(gulp)

    // Пути для сборки
var path = {
  build: {
      root: 'build/',
      js: 'build/',
      css: 'build/',
      fonts: 'build/',
      img: 'build/',
      allfiles: './build/*.*',
      gzip: 'build/gzip/'
  },
  src: {
      root: 'src/',
      html: 'src/html/**/*.html',
      fonts: 'src/fonts/*.*',
      woff: 'src/fonts/*.woff',
      inc: 'src/html/includes/',
      js: 'src/js/**/*.js',
      scripts: 'src/js/**/*.js',
      sass: 'src/scss/paper-dashboard.scss',
      css: 'src/css/',
      img: 'src/img/*.+(jpg|jpeg|png|gif)'
  },
  watch: {
      html: 'src/html/**/*.html',
      sass: 'src/scss/**/*.scss',
      js:   'src/js/**/*.js'
  },
  clean: ['build', 'src/index.html']
};

// Конфиги для локального вебсервера
var webserver = {
  dev: {
      server: {
          baseDir: './src'
      },
      tunnel: false,
      host: 'localhost',
      port: 9001,
      logPrefix: 'app_dev'
  },
  prod: {
      server: {
          baseDir: './build'
      },
      tunnel: true,
      host: 'localhost',
      port: 9002,
      logPrefix: 'app_prod'
  }
};    

// Очистка папок и файлов
gulp.task('clean', function() {
  return gulp.src(path.clean, {read: false})
      .pipe(clean());
});

// Запуск локального веб-сервера
// development
gulp.task('webserver:dev', function () {
  browserSync(webserver.dev);
});

// production
gulp.task('webserver:prod', function () {
  browserSync(webserver.prod);
});  

// Препроцессинг html
// development
gulp.task('html:dev', function() {
  gulp.src(path.src.html)
      .pipe(htmlPartial({
        basePath: path.src.inc
      }))
      .pipe(preprocess({context: {NODE_ENV: 'development', DEBUG: true}}))
      .pipe(gulp.dest(path.src.root))
      .pipe(browserSync.reload({stream: true}));
});

// production
gulp.task('html:prod', function() {
  gulp.src(path.src.html)
      .pipe(htmlPartial({
        basePath: path.src.inc
      }))
      .pipe(preprocess({context: {NODE_ENV: 'production', DEBUG: true}}))
      .pipe(gulp.dest(path.build.root))
});

// Копирование файлов fonts в папку продакшена
gulp.task("fonts", function() {
  return gulp.src(path.src.woff)
  .pipe(gulp.dest(path.build.fonts));
});

// Компиляция sass, сборка стилей
// Development
gulp.task('sass-css:dev', function() {
  return gulp.src(path.src.sass)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(preprocess({ context: { NODE_ENV: "development", DEBUG: true } })) // To set environment variables in-line
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.src.css))
      .pipe(browserSync.reload({stream: true}));
});
// Компиляция sass, сборка стилей
// Production
gulp.task('sass-css:prod',  function() {
  //Создание отдельного файла с bootstarp (merge для него не работает)
  gulp.src('src/css/bootstrap.min.css')
    .pipe(concat('bs.css'))
    .pipe(purify([path.src.js, path.src.html])) //поиск и удаление неиспользуемых кодов css
    .pipe(minifyCSS())
    .pipe(gulp.dest(path.build.css));

  return gulp.src(path.src.sass)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat('styles.css'))
    .pipe(preprocess({ context: { NODE_ENV: "production", DEBUG: true } })) // To set environment variables in-line
    .pipe(purify([path.src.js, path.src.html])) //поиск и удаление неиспользуемых кодов css
    .pipe(minifyCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css));
}); 


gulp.task('scripts', function() {
  //Для index.html
  gulp.src('src/js/charts/c3.js')
    .pipe(addsrc.append('src/js/charts/d3.v5.js'))
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js));

  //Для regulator.html
  gulp.src('src/js/charts/c3.js')
  .pipe(addsrc.append('src/js/plugins/x-editable.js'))
  .pipe(concat('regulator.js'))
  .pipe(uglify())
  .pipe(gulp.dest(path.build.js));


  //Для system.html
  gulp.src('src/js/plugins/moment.min.js')
    .pipe(addsrc.append('src/js/plugins/bootstrap-datetimepicker.js'))
    .pipe(concat('system.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js));

  //Для master.html
  gulp.src('src/js/plugins/jquery.bootstrap-wizard.js')
    .pipe(addsrc.append('src/js/plugins/jquery.validate.min.js'))
    .pipe(concat('master.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js));

  gulp.src('src/js/core/jquery.min.js')
    .pipe(addsrc.append('src/js/core/bootstrap.min.js'))
    .pipe(addsrc.append('src/js/plugins/perfect-scrollbar.jquery.min.js'))
    .pipe(addsrc.append('src/js/plugins/jquery.mobile.custom.js'))
    .pipe(addsrc.append('src/js/plugins/bootstrap-notify.js'))
    .pipe(addsrc.append('src/js/paper-dashboard.js'))
    .pipe(addsrc.append('src/js/arduino.js'))
    .pipe(addsrc.append('src/js/main.js'))
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js));
});

// Сжимаем картинки
gulp.task('img', function() {
  return gulp.src(path.src.img)
      .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true
      }))
      .pipe(gulp.dest(path.build.img));
});

// Архивация файлов в gzip
gulp.task('gzip', function() {
  return gulp.src(path.build.allfiles)
    .pipe(gzip())
    .pipe(gulp.dest(path.build.gzip));
});
//Загрузка на ftp Arduino - НЕ РАБОТАЕТ
gulp.task('ftp', function () {
  var conn = ftp.create( {
      host:     '192.168.0.23',
      user:     'esp8266wf',
      password: 'KJah8876',
      parallel: 10,
      maxConnections: 1
    });
  var globs = [ 'build/gzip/**' ];
  return gulp.src( globs, { base: './build/gzip/', buffer: false } )
  .pipe(conn.dest('/'));
});


// Слежение изменились ли файлы
gulp.task('watch', function() {
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:dev');
    });
    watch([path.watch.sass], function(event, cb) {
        gulp.start('sass-css:dev');
    });
    watch([path.watch.js]).on('change', browserSync.reload);
});

// Создание gzip и загрузка этих файлов на esp по ftp
gulp.task('esp', gulpsync.sync([
  'gzip',
  'ftp'
]));

// Режим разработки
gulp.task('develop', gulpsync.sync([
  'clean',
  [
      'html:dev',
      'sass-css:dev'
  ],
  'watch',
  'webserver:dev'
]));

// Режим production
gulp.task('production', gulpsync.sync([
  'clean',
  [
      'html:prod',
      'sass-css:prod',
      'img',
      'fonts',
      'scripts'
  ]
])); 