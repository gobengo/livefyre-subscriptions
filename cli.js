#!/usr/bin/env node

var options = require('nopt')({
    auth: String,
    h: Boolean
}, process.argv);

// -h help
if (options.h) {
    console.log('livefyre-subscriptions --auth=lftoken');
    process.exit(0);
}

// --auth lftoken is required
if ( ! options.auth) {
    console.error("Pass --auth=lftoken");
    process.exit(1);
}

var subscriptions = require('./index');
var userSubscriptions = subscriptions.forUser(options.auth);

userSubscriptions.get().then(function (data) {
    var subscriptions = data.subscriptions;
    console.log(JSON.stringify(subscriptions, null, '  '));
    process.exit(0);
});
