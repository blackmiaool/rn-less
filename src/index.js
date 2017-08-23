const postcss = require('postcss');

const configSelector = 'rn-config';

function traverse(obj, cb, path) {
    function handle(v, key) {
        if (typeof v == 'object' && v) {
            path.push(key);
            traverse(v, cb,path);
            path.pop();
            return v;
        } else {
            return cb(v, key,path);
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
    

    let steps=[];
    function addStep(func){
        steps.push(func);
    }
    addStep(function(value,property){
        const regexpArr = args.split(',').map(arg => arg.trim()).map(name => new RegExp(`(^|['"])` + name + "([\\[\\.]|$)"));
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
        traverse(input, function (value, key,path) {
            if(typeof key==='number'){
                return ;
            }
            const result=func(value,key);
            if(result!==undefined){
                return `[[[${result}]]]`
            }else{
                return value;
            }            
        },[]);
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
