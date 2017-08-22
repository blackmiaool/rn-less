const postcss = require('postcss');

const configSelector = 'rn-config';

function traverse(obj, cb) {
    function handle(v, key) {
        if (typeof v == 'object' && v) {
            traverse(v, cb);
            return v;
        } else {
            return cb(v, key);
        }
    }
    if (Array.isArray(obj)) {
        obj.filter(function (v, i) {
            const result = handle(v, i);
            if (result === undefined) {
                return false;
            } else {
                obj[i] = result;
                return true;
            }
        });
    } else {
        for (const key in obj) {
            const result = handle(obj[key], key);
            if (result === undefined) {
                delete obj[key];
            } else {
                obj[key] = result;
            }

        }
    }
}
module.exports = function ({code:rawCode,before,after}) {
    const input = JSON.parse(rawCode);
    // console.log(input);
    const ret = {};
    let config = {};
    if (input[configSelector]) {
        config = input[configSelector];
        delete input[configSelector];
    }
    let args = config.arguments || '';
    const regexpArr = args.split(',').map(arg => arg.trim()).map(name => new RegExp(`(^|['"])` + name + "([\\[\\.]|$)"));

    let steps=[];
    function addStep(func){
        steps.push(func);
    }
    addStep(function(value,property){
        console.log("!",value,property)
        if (typeof value === 'string') {
            if (regexpArr.some((regexp) => regexp.test(value))) {
                value = value.replace(/^['"]/, '').replace(/['"]$/, '');
                return value;
            }
        }
    });
    console.log(JSON.stringify(input));
    steps.forEach((func)=>{
        traverse(input, function (value, key) {
            if(typeof key==='number'){
                return ;
            }
            const result=func(value,key);
            if(result!==undefined){
                return `[[[${result}]]]`
            }else{
                return value;
            }            
        });
    });
    
    let result = JSON.stringify(input, false, 4);
    result = result.replace(/"\[\[\[/g, '')
        .replace(/\]\]\]"/g, '')
        .replace(/\n/g, '\n    ')
        .replace(/"style": {([^}]+)}/g, (full, content) => {
            return `"style": StyleSheet.create({${content}})`;
        });
    let code = `
const { StyleSheet } = require('react-native');
module.exports= function(${args}){
    return ${result}
}
`;
    console.log(code);
    return code;
}
