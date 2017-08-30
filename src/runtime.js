function rnLess(style) {
    const React = require('react');
    if(!React.rnLessOriginalCreateElement){//save original createElement
        React.rnLessOriginalCreateElement=React.createElement;
    }
    return function (target) {
        const originalRender = target.prototype.render;

        target.prototype.render = function (...renderArgs) {            
            //1. proxy the createElement
            React.createElement = fakeCreate;
            //2. start rendering
            const ret = originalRender.apply(this, renderArgs);
            //3. restore the createElement
            React.createElement = React.rnLessOriginalCreateElement;
            return ret;            
        };
    };
    //replace style string with the real style(number)
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
        return React.rnLessOriginalCreateElement.apply(this, args);
    }
}
module.exports = {
    rnLess,    
}