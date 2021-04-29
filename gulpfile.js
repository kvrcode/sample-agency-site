//required packages
const gulp = require( 'gulp' ),
      newer = require( 'gulp-newer' ),
      imagemin = require( 'gulp-imagemin' ),
      rename = require( 'gulp-rename' ),
      sass = require( 'gulp-sass' ),
      autoprefixer = require( 'gulp-autoprefixer' ),
      sourcemaps = require( 'gulp-sourcemaps' ),
      browserify = require( 'browserify' ),
      babelify = require( 'babelify' ),
      source = require( 'vinyl-source-stream' ),
      buffer = require( 'vinyl-buffer' ),
      uglify = require( 'gulp-uglify' ),
      sync = require( 'browser-sync' ).create();

//html
const htmlWatch = '**/*.html';

// image related variables
const imageDIST = './dist/img/',
      imageSRC = 'src/img/**/*';

//css related variables
const styleSRC = 'src/styles/main.scss',
      styleDIST = './dist/styles/',
      styleWatch = 'src/styles/**/*.scss';

//js related variables
const jsSRC = 'app.js',
      jsFolder = 'src/js/',
      jsDIST = './dist/js/',
      jsWatch = 'src/js/**/*.js',
      jsFiles = [jsSRC];


//task functions

function browser_sync() {

    sync.init({
        server: {
            baseDir: './'
        }
    });

};

function reload( done ) {
    sync.reload();
    done();
}

function images() {

    return gulp.src( imageSRC )  
               .pipe( newer( imageDIST ) )
               .pipe( imagemin({optimizationLevel: 5}) )  
               .pipe( rename( { suffix: '.min' } ) )
               .pipe( gulp.dest( imageDIST ) )

}

function styles( done ) {

    gulp.src( styleSRC )
        .pipe( sourcemaps.init() )
        .pipe( sass({
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }) )
        .on( 'error', console.error.bind( console ) )
        .pipe( autoprefixer('last 2 versions') )
        .pipe( rename( { suffix: '.min' } ) )
        .pipe( sourcemaps.write('./') )
        .pipe( gulp.dest( styleDIST ) )
        .pipe( sync.stream() );
        done();

};

function js( done ) {

    const entry = jsSRC;

    jsFiles.map(function( entry ) {

        return browserify({
            entries: [jsFolder + entry]
        })
        .transform( babelify, {presets: ['@babel/env']} )
        .bundle()
        .pipe( source( entry ) )
        .pipe( rename( { extname: '.min.js' } ) )
        .pipe( buffer() )
        .pipe( sourcemaps.init( { loadMaps: true } ) )
        .pipe( uglify() )
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( jsDIST ) )
        .pipe( sync.stream() );
    });
    done();

};

function watch() {

    gulp.watch(htmlWatch, reload);
    gulp.watch(styleWatch, styles);
    gulp.watch(jsWatch, gulp.series(js, reload));

}

//tasks

gulp.task('images', images);
gulp.task('styles', styles);
gulp.task('js', js);
gulp.task('default', gulp.parallel(styles, js));
gulp.task('watch', gulp.parallel(browser_sync, watch));