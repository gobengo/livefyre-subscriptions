var http = require('http');
var URN = require('./urn');
var Promise = require('promise');
var extend = require('util-extend');
var xtend = require('xtend');
var url = require('url');

// require('debug').enable('livefyre-subscriptions/client')
var log = require('debug')('livefyre-subscriptions/client')

exports.token = process.env.LFTOKEN || 'SET LFTOKEN';

/**
 * Request the API to a specific user's subscriptions
 * @param opts.network {string}
 * @param opts.user {string} URN of user
 */
exports.getForUser = function (user) {
    var userId = user.userId;
    var network = user.network;
    if ( ! user.lftoken) {
        user = userWithToken(user);
    }
    return getResponse(userSubscriptionsRequest(user))
        .then(function (res) {
            if (res.statusCode !== 200) {
                throw new Error('HTTP '+res.statusCode+' Error when getting subscriptions for '+JSON.stringify(opts));
            }
            return parseResponse(res);
        });
};

/**
 * Request the API to create a new subscription for a user
 */
exports.createForUser = function (user, subscription) {
    if ( ! user.lftoken) {
        user = userWithToken(user);
    }
    var fakePromise = new Promise(function (resolve, reject) {
        reject(new Error('IMPLEMENT THIS'));
    });
    var req = subscribeRequest({
        user: user,
        subscription: subscription
    });
    return new Promise(function (resolve, reject) {
        req.once('response', resolve);
        req.once('error', reject);
    }).then(function (res) {
        return parseResponse(res).then(function (resText) {
            if (res.statusCode !== 200) {
                throw new Error('HTTP '+res.statusCode+' Error when creating subscription: '+JSON.stringify(resText));
            }
            return resText;
        })
    });
};

function userWithToken(user) {
    return xtend(user, {
        lftoken: exports.token
    });
}

function getResponse(opts) {
    var req = http.request(opts);
    return new Promise(function (resolve, reject) {
        req.once('response', resolve);
        req.once('error', reject);
        req.end();
    }); 
}

function parseResponse(res) {
    var resText = ''
    res.on('data', function (d) {
        resText += d;
    });
    return new Promise(function (resolve, reject) {
        res.on('end', function () {
            try {
                var resObject = JSON.parse(resText);                
            } catch (e) {
                reject(e);
            }
            resolve(resObject);
        })
    });
}

var userSubscriptionsUrlTemplate = 'http://{quillHost}/api/v4/{userUrn}:subscriptions/?lftoken={lftoken}';
function userSubscriptionsUrl (opts) {
    return userSubscriptionsUrlTemplate
        .replace('{quillHost}', quillHost(opts))
        .replace('{lftoken}', opts.lftoken)
        .replace('{userUrn}', URN.forUser({
            network: opts.network,
            userId: opts.userId
        }));
}
function userSubscriptionsRequest(opts) {
    var req = url.parse(userSubscriptionsUrl(opts));
    log('userSubscriptionsRequest', req);
    return req;
}

function networkName(network) {
    return network.split('.')[0];
}

function quillHost(opts) {
    if (opts.network === 'livefyre.com') {
        return 'quill.livefyre.com';
    }
    return networkName(opts.network) + '.quill.fyre.co';
}



function subscribeRequest(opts) {
    var user = opts.user;
    var requestData = {
        subscriptions: [opts.subscription]
    };
    var requestString = JSON.stringify(requestData);

    var requestOptions = url.parse(userSubscriptionsUrl(user));
    requestOptions.method = 'POST';
    requestOptions.headers = {
        'Content-Type': 'application/json',
        'Content-Length': requestString.length
    };
    var req = http.request(requestOptions);
    req.write(requestString);
    req.end();
    return req;
}
