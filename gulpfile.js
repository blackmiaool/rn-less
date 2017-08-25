const gulp = require('gulp');
const less = require('gulp-less');
const transform=require('gulp-transform');
const rncss=require('./src/react-native-css');
const style2object = require('./src/index');
const rename = require("gulp-rename");

gulp.task('css', function () {
    return gulp.src(['./**/*.less','!node_modules/{,/**}'],{
        base:'.'
    })
        .pipe(less({
            // paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(transform('utf8',(code)=>{
            return JSON.stringify(rncss(code),false,4);
        }))
        .pipe(transform('utf8',(code)=>{
            code=style2object({code});
            return code;
        }))
        .pipe(rename({
            extname:'.less.js'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('default', (() => {
    gulp.start(['css']);
}));
