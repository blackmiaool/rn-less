const postcss = require('postcss');

const configSelector = 'rn-config';

function traverse(obj, cb) {
    function handle(v) {
        if (typeof v == 'object' && v) {
            traverse(v, cb);
        } else {
            return cb(v);
        }
    }
    if (Array.isArray(obj)) {
        obj.map(function (v, i) {
            obj[i] = handle(v)||v;
        });
    } else {
        for (const key in obj) {
            obj[key] = handle(obj[key])||obj[key];
        }
    }
}
module.exports = function (rawCode) {
    const input = JSON.parse(rawCode);
    console.log(input);
    const ret = {};
    let config = {};
    if (input[configSelector]) {
        config = input[configSelector];
        delete input[configSelector];
    }
    let args = config.arguments || '';
    const regexpArr=args.split(',').map(arg=>arg.trim()).map(name=>new RegExp(`(^|['"])`+name+"([\\[\\.]|$)"));
    traverse(input,function(value){
        if(typeof value==='string'){
            if(regexpArr.some((regexp)=>regexp.test(value))){
                value=value.replace(/^['"]/,'').replace(/['"]$/,'');
                return `[[[${value}]]]`;
            }
        }
        console.log(value);
        return value;
    });
    let result=JSON.stringify(input,false,4);
    result=result.replace(/"\[\[\[/g,'')
                .replace(/\]\]\]"/g,'')
                .replace(/\n/g,'\n    ')
                .replace(/"style": {([^}]+)}/g,(full,content)=>{
                    return `"style": StyleSheet.create({${content}})`;
                })
    let code = `
const { StyleSheet } = require('react-native');
module.exports= function(${args}){
    return ${result}
}
`;
    console.log(code);
    return code;
}
