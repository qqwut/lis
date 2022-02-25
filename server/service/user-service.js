exports.userGroupToArray = function(userGroup, prop) {
    try {
        let propAtt = prop.toString();
        let splitGroup = userGroup.split(",");
        let groupArray = [];
        for (var index = 0; index < splitGroup.length; index++) {
            let element = {};
            element[propAtt] = splitGroup[index];
            // let element = {
            //     '' + propAtt: splitGroup[index]
            // }
            groupArray.push(element);
        }
        return groupArray
    } catch (error) {
        return [];
    }
}

module.exports = exports;