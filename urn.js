var log = require('debug')('livefyre-subscriptions/urn');

/**
 * Create a Livefyre URN for a user in a given Livefyre Network
 * @param is the user's global id, e.g. 'ben@network.fyre.co'
 */
exports.forUser = function (user) {
    if (typeof user === 'string') {
        user = userFromString(user);
    }
    return userUrnTemplate(user);
}

function userFromString(userString) {
    try {
        return URN.forUser.parse(user);
    } catch (e) {
        log('userFromString not passed a urn');
    }
    var userParts = userString.split('@');
    if (userParts.length < 2) {
        throw new Error("Invalid global userId passed in. Try userId@network.fyre.co");
    }
    return {
        userId: userParts[0],
        network: userParts[1]
    }
}

var userUrnPattern = /urn:livefyre:([^:]+):user=([^:]+)/;
exports.forUser.parse = function (userUrn) {
    var match = userUrn.match(userUrnPattern);
    if ( ! match) {
        throw new Error('Invalid user URN: '+userUrn);
    }
    return {
        network: match[1],
        userId: match[2]
    };
}

/**
 * Template of a Livefyre User URN
 * @param data.network {string} networkId.fyre.co
 * @param data.userId {string} unique id for the user within the network
 */
function userUrnTemplate(data) {
    var urn = 'urn:livefyre:{network}:user={userId}'
        .replace('{network}', data.network)
        .replace('{userId}', data.userId);
    return urn;
}
