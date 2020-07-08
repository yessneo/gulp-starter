const gulp = require('gulp');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const sync = require('browser-sync');
const replace = require('gulp-replace');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const plumber = require('gulp-plumber');



// HTML

const html = () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
        }))
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
};

exports.html = html;

// Styles

const styles = () => {
    return gulp.src('src/sass/main.scss')
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(cleancss( { level: { 1: { specialComments: 0 } }, format: 'beautify' } )) 
    .pipe(gulp.dest('dist/styles'))
    .pipe(sync.stream());
}

exports.styles = styles;


// Server

const server = () => {
	sync.init({ // Инициализация Browsersync
		server: { baseDir: 'dist' }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true // Режим работы: true или false
	});
};

exports.server = server;

// Scripts

const scripts = () => {
    return gulp.src('src/scripts/index.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(terser())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(sync.stream());
};

exports.scripts = scripts;

// Copy

const copy = () => {
    return gulp.src([
            'src/fonts/**/*',
            'src/img/**/*',
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream({
            once: true
        }));
};

exports.copy = copy;

// Paths
// const paths = () => {
//     return gulp.src('dist/*.html')
//         .pipe(replace(
//             /(<link rel="stylesheet" href=")styles\/(index.css">)/, '$1$2'
//         ))
//         .pipe(replace(
//             /(<script src=")scripts\/(index.js">)/, '$1$2'
//         ))
//         .pipe(gulp.dest('dist'));
// };

// exports.paths = paths;


// Watch

const watch = () => {
    gulp.watch('src/*.html', gulp.series(html));
    gulp.watch('src/sass/**/*.scss', gulp.series(styles));
    gulp.watch('src/scripts/**/*.js', gulp.series(scripts));
    gulp.watch([
        'src/fonts/**/*',
        'src/images/**/*',
    ], gulp.series(copy));
}

// Default

exports.default = gulp.series(
    gulp.parallel(
        html,
        styles,
        scripts,
        copy,
    ),
    gulp.parallel(
        watch,
        server,
    ),
);