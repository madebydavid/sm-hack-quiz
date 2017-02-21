
/**
 * Returns a sequence of 4 random HEX chars
 * 
 * @return {string} 
 */
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};


/**
 * Returns a full, random GUID string
 * 
 * @return {string}
 */
module.exports = function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};