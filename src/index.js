const postcss = require('postcss');
const JSON5=require('json5');
const configSelector = 'rn-config';

function traverseStyle(root, handleStyle, handleProperty) {
    for (const component in root) {
        for (const selector in root[component]) {
            const arr = root[component][selector];
            arr.forEach((chunk) => {
                chunk.style = handleStyle(chunk.style);
                for (const key in chunk.style) {
                    const value = chunk.style[key];
                    const selectors = chunk.selectors.concat([selector, component]);
                    const result = handleProperty(value, key, selectors);
                    if (result === undefined) {
                        delete chunk.style[key];
                    } else {
                        chunk.style[key] = result;
                    }
                }
            });
        }
    }
}
module.exports = function ({
    code: rawCode,
    before,
    after
}) {
    const input = JSON.parse(rawCode);
    // console.log(input);
    const ret = {};
    let config = {};
    if (input[configSelector]) {
        config = input[configSelector];
        delete input[configSelector];
    }
    let args = config.arguments || '';


    let steps = [];

    function addStep(func) {
        steps.push(func);
    }
    addStep(function (value, property, selectors) {
        const regexpArr = args.split(',').map(arg => arg.trim()).map(name => new RegExp(`(^|['"])` + name + "([\\[\\.]|$)"));
        console.log("!", value, property, selectors)
        if (typeof value === 'string') {
            if (regexpArr.some((regexp) => regexp.test(value))) {
                value = value.replace(/^['"]/, '').replace(/['"]$/, '');
                return value;
            }
        }
    });
    console.log(JSON.stringify(input));
    steps.forEach((func) => {
        traverseStyle(input, function (style, selectors) {
            return style;
        }, function (value, key, selectors) {
            const result = func(value, key, selectors);
            if (result !== undefined) {
                return `[[[${result}]]]`
            } else {
                return value;
            }
        }, []);
    });

    let result = JSON5.stringify(input, false, 4);
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
