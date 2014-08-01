var http = require('http');
var URN = require('./urn');
var Promise = require('promise');
var extend = require('util-extend');
var xtend = require('xtend');

// require('debug').enable('livefyre-subscriptions/client')
var log = require('debug')('livefyre-subscriptions/client')

exports.token = process.env.LFTOKEN || 'SET LFTOKEN';

/**
 * Request the API to a specific user's subscriptions
 * @param opts.network {string}
 * @param opts.user {string} URN of user
 */
exports.getForUser = function (opts) {
    var userId = opts.userId;
    var network = opts.network;
    if ( ! opts.lftoken) {
        opts = xtend(opts, {
            lftoken: exports.token
        });
    }
    return getResponse(userSubscriptionsRequest(opts))
        .then(function (res) {
            if (res.statusCode !== 200) {
                throw new Error('HTTP '+res.statusCode+' Error when getting subscriptions for '+JSON.stringify(opts));
            }
            return parseResponse(res);
        });
};

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
            if ( ! resObject.subscriptions) {
                resObject.subscriptions = [];
            }
            resolve(resObject);
        })
    });
}

var userSubscriptionsUrlTemplate = 'http://{quillHost}/api/v4/{userUrn}:subscriptions/?lftoken={lftoken}';
function userSubscriptionsUrl (opts) {
    console.log('url opts', opts);
    return userSubscriptionsUrlTemplate
        .replace('{quillHost}', quillHost(opts))
        .replace('{lftoken}', opts.lftoken)
        .replace('{userUrn}', URN.forUser({
            network: opts.network,
            userId: opts.userId
        }));
}
function userSubscriptionsRequest(opts) {
    var req = require('url').parse(userSubscriptionsUrl(opts));
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
