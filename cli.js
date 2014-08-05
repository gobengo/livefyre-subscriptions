#!/usr/bin/env node

var Promise = require('promise');

var options = require('nopt')({
    auth: String,
    add: Boolean,
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

var desiredSubscriptions = [
  {
    "to": "urn:livefyre:demo.fyre.co:site=362588:topic=los_angeles",
    "type": "personalStream"
  },
  {
    "to": "urn:livefyre:demo.fyre.co:site=362588:topic=mlb",
    "type": "personalStream"
  },
  {
    "to": "urn:livefyre:demo.fyre.co:site=362588:topic=business",
    "type": "personalStream"
  },
  {
    "to": "urn:livefyre:demo.fyre.co:site=362588:topic=sports",
    "type": "personalStream"
  },
  {
    "to": "urn:livefyre:demo.fyre.co:site=362588:topic=entertainment",
    "type": "personalStream"
  }
]

// if --add, add subscriptions and return
if (options.add) {
  var subscribeToThings = desiredSubscriptions.map(userSubscriptions.create.bind(userSubscriptions));
  Promise.all(subscribeToThings).then(
      function (data) {
          console.log('success subscribing!', data);
          process.exit(0);
      },
      function (err) {
          console.error('Error subscribing', err);
          process.exit(1);
      }
  )
  return;
}

userSubscriptions.get().then(
    function (data) {
        var subscriptions = data.subscriptions;
        if (subscriptions) {
            console.log(JSON.stringify(subscriptions, null, '  '));            
        } else {
            console.log("There are no subscriptions");
        }
        process.exit(0);
    },
    function (err) {
        console.error('Error getting subscriptions', err.stack);
        process.exit(1);
    }
);
