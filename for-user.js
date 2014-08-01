module.exports = SubscriptionsForUser;

var URN = require('./urn');
var subscriptionsClient = require('./client');
var extend = require('util-extend');
var Promise = require('promise');

function SubscriptionsForUser(user) {
    if ( ! (this instanceof SubscriptionsForUser)) {
        return new SubscriptionsForUser(user);
    }
    this._user = typeof user === 'string'
        ? userFromString(user)
        : user;
    return this;
};

extend(SubscriptionsForUser.prototype, {
    client: subscriptionsClient,
    /**
     * return a promise for the user's subscriptions
     */
    get: function getUserSubscriptions() {
        var user = this._user;
        return this.client.getForUser(user);
    }
});

function userFromString(userString) {
    try {
        return URN.forUser.parse(userString);
    } catch (e) {
        var userParts = userString.split('@');
        return {
            userId: userParts[0],
            network: userParts[1]
        }
    }
}
