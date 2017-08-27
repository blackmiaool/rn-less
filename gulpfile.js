const gulp = require('gulp');
const less = require('gulp-less');
const transform = require('gulp-transform');
const rncss = require('./src/react-native-css');
const {
    processStyleobject
} = require('./src/index');
const rename = require("gulp-rename");

gulp.task('css', function () {
    return gulp.src(['./**/*.less', '!node_modules/{,/**}'], {
            base: '.'
        })
        .pipe(less({}))
        .pipe(transform('utf8', (code) => {
            try {
                code = JSON.stringify(rncss(code), false, 4);
            } catch (e) {
                console.log(e);
            }
            return code;
        }))
        .pipe(transform('utf8', (code) => {
            try {
                code = processStyleobject({
                    code,
                    hierarchy: false,
                    custom: function ({
                        root,
                        traverseProperty
                    }) {
                        traverseProperty(root,function({value,property}){
                            console.log(value,property)
                            if(property==='fontSize'){
                                return `Theme.font${value}`;
                            }
                        });
                    }
                });
            } catch (e) {
                console.log(e);
            }
            return code;
        }))
        .pipe(rename({
            extname: '.less.js'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('default', (() => {
    gulp.start(['css']);
}));
