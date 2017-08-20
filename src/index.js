const postcss = require('postcss');
const rncss=require('../react-native-css').default;

module.exports = function(arr){
    console.log(arr);
    const ret={};    
    return arr;
}
// postcss.plugin('rn-less', function myplugin(options) {

//     return function (css) {
//         // console.log(css);
//         console.log(rncss(css.source.input.css));
//         options = options || {};
//         css.walkRules(function (rule) {
//             // console.log(rule);;
//             rule.walkDecls(function (decl, i) {
//                 // console.log(decl);


//             });
//         });
//     }
// });
