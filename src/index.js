const JSON5 = require('json5');
const configSelector = 'rn-config';

function traverseChunk(root, cb) {
    for (const component in root) {
        for (const styleStr in root[component]) {
            let arr = root[component][styleStr];
            root[component][styleStr]=arr.map(function (chunk,i) {
                const result = cb(chunk, styleStr, component);
                if (result !== undefined) {
                    return result;
                }else{
                    return chunk;
                }
            });
        }
    }
}

function traverseStyle(root, func) {
    traverseChunk(root, function (chunk, styleStr, component) {
        const style = chunk.style;
        let result = func({
            style,
            selector: styleStr,
            chunk,
            component
        });
        if (typeof result === 'string') {
            result = `[[[${result}]]]`
        }
        chunk.style = result;
    });
}

function traverseProperty(root, func) {
    traverseChunk(root, function (chunk, styleStr, component) {
        const style = chunk.style;
        for (const key in style) {
            const value = style[key];
            const selector = chunk.selector.concat([styleStr, component]);
            let result = func(value, key, selector);
            if (result === undefined) {
                delete style[key];
            } else {
                result = `[[[${result}]]]`
                style[key] = result;
            }
        }
    });
}

module.exports = function ({
    code: rawCode,
    hierarchy: useHierarchy = false,
    before,
    after
}) {
    const input = JSON.parse(rawCode);
    // console.log(input);
    const ret = {};
    let codeBeforeReturn = '';
    let config = {};
    if (input[configSelector]) {
        config = input[configSelector];
        delete input[configSelector];
    }
    let args = config.arguments || '';

    //flatten style
    if (!useHierarchy) { 
        for (const component in input) {
            for (const styleStr in input[component]) {
                const arr = input[component][styleStr];
                input[component][styleStr] = [{
                    selector:[],
                    style: arr.reduce(function (p,{style}) {
                        Object.assign(p,style);
                        return p;
                    }, {})
                }];
            }
        }
    }

    //sort property
    traverseStyle(input, function ({
        style
    }) { 
        const ret = {};
        Object.keys(style).sort().forEach((key) => {
            ret[key] = style[key];
        });
        return ret;
    });

    //make variables work
    traverseProperty(input, function (value, property, selector) { 
        const regexpArr = args.split(',').map(arg => arg.trim()).map(name => new RegExp(`(^|['"])` + name + "([\\[\\.\"]|$)"));
        if (typeof value === 'string') {
            if (regexpArr.some((regexp) => regexp.test(value))) {
                value = value.replace(/^['"]/, '').replace(/['"]$/, '');
                return value;
            }
        }
        return value;

    });

    //use StyleSheet.create to create style
    const styleSheetArr = [];
    traverseStyle(input, function ({
        style
    }) { 
        const str = JSON.stringify(style);
        const index = styleSheetArr.indexOf(str);
        if (index === -1) {
            return `allStyle[${styleSheetArr.push(str) - 1}]`;
        } else {
            return `allStyle[${index}]`;
        }
    });
    const styleSheetObj = {};
    styleSheetArr.forEach((style, index) => {
        styleSheetObj[index] = JSON.parse(style);
    });
    codeBeforeReturn = `const allStyle = StyleSheet.create(${JSON5.stringify(styleSheetObj,false,4)});`

    //flatten style
    if (!useHierarchy) { 
        for (const component in input) {
            for (const styleStr in input[component]) {
                input[component][styleStr]=input[component][styleStr][0].style;
            }
        }
    }

    let result = JSON5.stringify(input, false, 4).replace(/\n/g, '\n    ');

    let code = `
const { StyleSheet } = require('react-native');

module.exports= function({${args}}){
    ${codeBeforeReturn.replace(/\n/g, '\n    ')}

    return ${result}
}
`;
    code = code.replace(/"\[\[\[/g, '')
        .replace(/\]\]\]"/g, '');

    // console.log(code);
    return code;
}
