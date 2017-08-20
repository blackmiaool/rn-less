
module.exports = (part) => {
    let type;
    let data;
    if (part[0] === '.') {
        type = 'class';
        data = part.slice(1);
    } else if (part[0] === '#') {
        type = 'id';
        data = part.slice(1);
    } else if (part[0] === '[') {
        type = 'attr';
        const matchResult = part.match(/^\[([\w-]+)(?:=(['"])?([\w-]+)\2?)?\]$/);
        if (!matchResult) {
            alert(`invalid part:${part}`);
            return {};
        }
        data = { attr: matchResult[1], value: matchResult[3] };
    } else {
        type = 'tag';
        data = part;
    }
    return {
        type, data
    };
}

