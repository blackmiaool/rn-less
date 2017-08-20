function rncss(style) {
    function testHierarchy(selectors, hierarchy) {
        let index1 = 0;
        let index2 = 0;
        const length1 = selectors.length;
        const length2 = hierarchy.length;
        for (;index1 < length1; index1++) {
            for (;index2 < length2; index2++) {
                if (selectors[index1] === hierarchy[index2]) {
                    break;
                }
            }
            if (index2 === length2) {
                return false;
            }
        }
        return true;
    }
    return function (target) {
        const originalRender = target.prototype.render;

        target.prototype.render = function (...args) {
            const origianlCreateElement = React.createElement;

            function fakeCreate(...args) {
                // console.warn(args[1].key);
                if (args[1].style) {
                    if (!Array.isArray(args[1].style)) {
                        args[1].style = [args[1].style];
                    }
                } else {
                    args[1].style = [];
                }
                return origianlCreateElement.apply(this, args);
            }
            fakeCreate.isFake = true;

            if (!React.createElement.isFake) { //prevent nested proxy
                React.createElement = fakeCreate;
            }

            const ret = originalRender.apply(this, args);
            function traverse(node, hierarchy) {
                let index;
                let len;
                let section;
                let styleValue;
                const className = node.key || node.props && node.props.styleKey;
                if (className) {
                    if (style[className]) {
                        const styleArr = style[className];

                        for (index = 0, len = styleArr.length; index < len; index++) {
                            styleValue = styleArr[index].style;
                            section = styleArr[index];

                            if (!section.selectors || section.selectors && testHierarchy(section.selectors, hierarchy)) {
                                if (node.props && node.props.style) {
                                    if (Array.isArray(node.props.style)) {
                                        node.props.style.unshift(styleValue);
                                    }
                                }
                            }
                        }
                    }
                    hierarchy.push(className);
                }

                if (node.props && node.props.children) {
                    if (Array.isArray(node.props.children)) {
                        node.props.children.forEach(child => traverse(child, hierarchy));
                    } else {
                        traverse(node.props.children, hierarchy);
                    }
                }
                hierarchy.pop();
            }
            traverse(ret, []);
            React.createElement = origianlCreateElement;
            return ret;
        };
    };
}