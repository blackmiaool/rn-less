const gulp = require('gulp');
const less = require('gulp-less');
const transform = require('gulp-transform');
const rncss = require('./src/react-native-css');
const {
    processStyleobject
} = require('./src/index');
const rename = require("gulp-rename");

const sourceDir = './example';
gulp.task('css', function () {
    return gulp.src([`${sourceDir}/**/*.less`], {
        base: sourceDir
    })
        .pipe(less({}))
        .pipe(transform('utf8', (code) => {
            try {
                code = JSON.stringify(rncss(code), false, 4);
            } catch (e) {
                console.log(e);
            }
            console.log(code)
            return code;
        }))
        .pipe(transform('utf8', (code) => {
            try {
                code = processStyleobject({
                    code,
                    hierarchy: false,
                    custom: function ({
                        root,
                        traverseProperty,
                        traverseStyle,
                        traverseChunk
                    }) {
                        // font-size:10 -> fontSize:Theme.font10
                        traverseProperty(root, function ({ value, property, selector }) {
                            if (property === 'fontSize') {
                                return `Theme.font${value}`;
                            }
                        });

                        // sort the keys 
                        traverseStyle(root, function ({ style, selector, chunk, component }) {
                            const ret = {};
                            Object.keys(style).sort().forEach((key) => {
                                ret[key] = style[key];
                            });
                            return ret;
                        });

                        //print the chunks
                        traverseChunk(root, function ({ chunk, styleName, component }) {
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
        .pipe(gulp.dest(sourceDir));
});

gulp.task('default', (() => {
    gulp.start(['css']);
}));
gulp.watch(`${sourceDir}/**/*.less`, ['css']);
