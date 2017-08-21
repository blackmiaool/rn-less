const ParseCSS = require('css/lib/parse');

const utils = require('./utils');
const {
    getStyleDecls
} = require("./style");

module.exports= function toJSS(css) {

    const JSONResult = {
        default: {}
    };

    const stylesheetString = Array.isArray(css) ? css[0] : css;
    const {
        stylesheet
    } = ParseCSS(utils.clean(stylesheetString));

    function isRoot(str) {
        return /^(?![\.#])/.test(str);
    }

    function strip(str) {
        return str.replace(/^\./, '');
    }
    for (const rule of stylesheet.rules) {
        if (rule.type !== 'rule') continue;

        for (const selector of rule.selectors) {
            
            // selector = selector.replace(/\./g, '');


            // check if there are any selectors with empty spaces, meaning they should be nested

            const selectorPath = selector.split(/\s+/).map(currentSelector => currentSelector);

            // we don't have to be smart here. It's either an object or undefined.
            // console.log('selectorPath', selectorPath);
            // console.log('selector', selector);
            let component;

            if (isRoot(selectorPath[0])) {
                component = selectorPath[0];
                if (!JSONResult[component]) {
                    JSONResult[component] = {};
                }
                component = JSONResult[component];
            } else {
                component = JSONResult.default;
            }
            const key = strip(selectorPath[selectorPath.length - 1]);
            const selectors = selectorPath;
            if (selectors.length === 1 && selectors[0] === 'rn-config') {
                rule.declarations.forEach(item => component[item.property] = item.value);
                continue;
            }
            selectors.pop();
            if (selectors.length && isRoot(selectors[0])) {
                selectors.shift();
            }
            if (!component[key]) {
                component[key] = [];
            }
            if (selectors.length) {
                component[key].push({
                    selectors: selectors.reverse().map(strip),
                    style: getStyleDecls(rule)
                });
            } else {
                component[key].push({
                    style: getStyleDecls(rule)
                });
            }


            // const styles = {
            //     selector: selector
            //             .split(' ')
            //             .map(sel => parseSelector(sel))
            // };
            // console.log(JSONResult);
            // JSONResult.push(styles);
        }
    }

    return JSONResult;
}
