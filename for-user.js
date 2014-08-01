module.exports = SubscriptionsForUser;

var URN = require('./urn');
var subscriptionsClient = require('./client');
var extend = require('util-extend');
var Promise = require('promise');
var base64url = require('base64url');

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
     * promise to get the user's subscriptions
     */
    get: function getUserSubscriptions() {
        var user = this._user;
        return this.client.getForUser(user);
    },
    /**
     * promise to create a subscription
     */
    create: function createSubscription(subscription) {
        var user = this._user;
        return this.client.createForUser(user, subscription)
            .then(function (resObj) {
                return resObj.data
            });
    }
});

function userFromString(userString) {
    try {
        return URN.forUser.parse(userString);
    } catch (e) {
    }
    try {
        return userFromToken(userString);
    } catch (e) {
    };
    var userParts = userString.split('@');
    return {
        userId: userParts[0],
        network: userParts[1]
    }
}

function userFromToken(token) {
    var tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        throw new Error('Invalid lftoken: '+token);
    }
    var tokenJson = base64url.decode(tokenParts[1]);
    var tokenData = JSON.parse(tokenJson);
    return {
        network: tokenData.domain,
        userId: tokenData.user_id
    };
}
