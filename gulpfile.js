'use strict';
/* 
.task () - создает задачу
.src () - определяет, какие файлы вы будете компилировать в конкретной задаче
.pipe () - добавляет функцию в поток Node, который использует Gulp; Вы можете передать несколько функций в одной задаче (прочитайте отличную статью на эту тему на florian.ec )
.dest () - записывает полученный файл в определенное место
.watch () - определяет файлы для обнаружения любых изменений */

const gulp = require('gulp');
const sass = require('gulp-sass'); //npm install node-sass gulp-sass --save-dev | Преобразовывает scss в css
const concat = require('gulp-concat'); //npm install --save-dev gulp-concat | Соединяет все файлы в один
const debug = require('gulp-debug'); //npm install --save-dev gulp-debug | Выводит поток который через него проходит
const sourcemaps = require('gulp-sourcemaps'); //npm install --save-dev gulp-sourcemaps | Создает sourcemaps для
const gulpIf = require('gulp-if'); // npm install --save-dev gulp-if | В зависимости от условии выполняет поток
const del = require('del'); // npm install --save-dev del | Удалят файлы
const newer = require('gulp-newer') //npm install --save-dev gulp-newer  | Для пропускания через только те исходные файлы, которые новее , чем соответствующие файлы назначение.
const browserSync = require('browser-sync').create() //npm install --save-dev browser-sync | Обновление браузера при изменении (НАДО ПОДНЯТЬ СЕРВЕР)
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development'
// Если запускать команду без NODE_ENV или запускать пустым то false аа значит не продакшн

gulp.task('js', () => {
  return gulp.src('frontend/js/index.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .on('error', function handleError() {
      this.emit('end'); // Recover from errors
    })
    .pipe(gulp.dest('./public'));
});

gulp.task('styles', function () {
  /* 
  Задача
  1) Найти ГЛАВНЫЙ main.scss
  2) Создать sourcemap
  3) Превратить найденный файл в css
  4) Положить sourcemap в итоговый файл
  5) Положить все файлы в public  
  */
  return gulp.src('frontend/styles/main.scss') //1
    .pipe(gulpIf(isDevelopment, sourcemaps.init())) //2
    .pipe(debug({
      title: 'src'
    }))
    .pipe(sass()) //3
    .pipe(debug({
      title: 'scss'
    }))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulpIf(isDevelopment, sourcemaps.write())) //4
    .pipe(gulp.dest('public')) //5
});

gulp.task('clean', function () {
  /* 
  Задача
  Удалить папку del */
  return del('public')
});

gulp.task('assets', function () {
  /* 
  Задача
  1) Найти все файлы в assets
  2) Проверка на наличие файлов поновее
  3) Положить все файлы в public */
  return gulp.src('frontend/assets/**', {
      since: gulp.lastRun('assets')
    }) //1
    .pipe(gulp.dest('public')) //3
});

gulp.task('images', function () {
  return gulp.src('frontend/assets/img/**')
    .pipe(newer('public')) //2
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest('public/img'))
})

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'assets', 'js')));

gulp.task('watch', function () {
  gulp.watch('frontend/styles/**/**.scss', gulp.series('styles'))
  gulp.watch('frontend/assets/**/**.*', gulp.series('assets'))
  gulp.watch('frontend/**/**.js', gulp.series('js'))
})

gulp.task('serve', function () {
  /* Задача 
  Поднять сервер browserSync */
  // require the module as normal
  browserSync.init({
    server: 'public'
  });

  browserSync.watch('public/**/*.*').on('change', browserSync.reload)
})

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')))