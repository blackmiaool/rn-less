const JSON5 = require('json5');
const configSelector = 'rn-config';

function traverseChunk(root, cb) {
    for (const component in root) {
        for (const styleStr in root[component]) {
            let arr = root[component][styleStr];
            root[component][styleStr] = arr.map(function (chunk, i) {
                const result = cb(chunk, styleStr, component);
                if (result !== undefined) {
                    return result;
                } else {
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
        for (const property in style) {
            const value = style[property];
            const selector = chunk.selector.concat([styleStr, component]);
            let result = func({value, property, selector});
            if (result === null) {
                delete style[property];
            } else if (result === undefined) {
                //do nothing
            } else {
                result = `[[[${result}]]]`;
                style[property] = result;
            }
        }
    });
}

function rnLess(style) {
    const React = require('react');
    return function (target) {
        const originalRender = target.prototype.render;

        target.prototype.render = function (...renderArgs) {
            const origianlCreateElement = React.createElement;

            function fakeCreate(...args) {
                if (args && args[1] && args[1].style) {
                    if (typeof args[1].style === 'string') {
                        args[1].style = [args[1].style];
                    }
                    if (Array.isArray(args[1].style)) {
                        args[1].style.forEach((styleName, i) => {
                            if (typeof styleName === 'string') {
                                if (style[styleName]) {
                                    args[1].style[i] = style[styleName];
                                } else {
                                    console.warn(`can't find style`, styleName);
                                }
                            }
                        });
                    }
                }
                return origianlCreateElement.apply(this, args);
            }
            fakeCreate.isFake = true;

            if (!React.createElement.isFake) { //prevent nested proxy
                React.createElement = fakeCreate;
            }
            const ret = originalRender.apply(this, renderArgs);
            React.createElement = origianlCreateElement;
            return ret;
        };
    };
}

function processStyleobject({
    code: rawCode,
    hierarchy: useHierarchy = false,
    custom
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
                    selector: [],
                    style: arr.reduce(function (p, {
                        style
                    }) {
                        Object.assign(p, style);
                        return p;
                    }, {})
                }];
            }
        }
    }
    if (custom) {
        custom({
            root: input,
            traverseChunk,
            traverseStyle,
            traverseProperty
        });
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
    traverseProperty(input, function ({value, property, selector}) {
        const regexpArr = args.split(',').map(arg => arg.trim()).map(name => new RegExp(`(^|['"])` + name + "([\\[\\.\"?]|$)"));
        if (typeof value === 'string') {
            if (regexpArr.some((regexp) => regexp.test(value))) {
                value = value.replace(/^['"]/, '').replace(/['"]$/, '');
                return value;
            }
        }
    });

    //use StyleSheet.create to create style
    const styleSheetArr = [];
    traverseStyle(input, function ({
        style
    }) {
        const str = JSON.stringify(style);
        let index = styleSheetArr.indexOf(str);
        if (index === -1) {
            styleSheetArr.push(str);
            index = styleSheetArr.length - 1;
        }
        return `allStyle.s${index}`;
    });
    const styleSheetObj = {};
    styleSheetArr.forEach((style, index) => {
        styleSheetObj['s' + index] = JSON.parse(style);
    });
    codeBeforeReturn = `const allStyle = StyleSheet.create(${JSON5.stringify(styleSheetObj,false,4)});`

    //flatten style
    if (!useHierarchy) {
        for (const component in input) {
            for (const styleStr in input[component]) {
                input[component][styleStr] = input[component][styleStr][0].style;
            }
        }
    }

    let result = JSON5.stringify(input, false, 4).replace(/\n/g, '\n    ');

    let code = `
const { StyleSheet } = require('react-native');

module.exports = function({${args}}){
    ${codeBeforeReturn.replace(/\n/g, '\n    ')}

    return ${result};
};
`;
    code = code.replace(/"\[\[\[/g, '')
        .replace(/\]\]\]"/g, '');
    // console.log(code);
    return code;
}
module.exports = {
    rnLess,
    processStyleobject
}
