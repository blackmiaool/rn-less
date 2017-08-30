const gulp = require('gulp');
const less = require('gulp-less');
const transform = require('gulp-transform');
//or just copy the runtime file to your project
const rncss = require('rn-less/src/react-native-css');
const {
    processStyleobject
} = require('rn-less/src/index');
const rename = require("gulp-rename");

const sourceDir='./app';
gulp.task('css', function () {
    return gulp.src([`${sourceDir}/**/*.less`], {
        base: sourceDir
    })
    .pipe(less({}))
    .pipe(transform('utf8', (code) => {
        code = JSON.stringify(rncss(code), false, 4);
        return code;
    }))
    .pipe(transform('utf8', (code) => {
        code = processStyleobject({
            code,
            hierarchy: false,
            custom: function ({
                root,
                traverseProperty
            }) {

            }
        });
        return code;
    }))
    .pipe(rename({
        extname: '.less.js'
    }))
    .pipe(gulp.dest(sourceDir));
});

gulp.task('default', (() => {
    gulp.start(['css']);
}));

gulp.watch(`${sourceDir}/**/*.less`, ['css']);
