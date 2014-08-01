# livefyre-subscriptions

A JavaScript library for [managing Subscriptions](http://docs.livefyre.com/beta-docs/personalizedstream/personalized-streams/subscription-apis/) in Livefyre's Personalized News Stream service.

## Using

This module is intended to work in both node.js and the browser (via browserify). Run `make dist` to put the browser bundle in dist/.

```javascript
var subscriptions = require('livefyre-subscriptions');
```

## API

The main export is an object.

### `.forUser(user)`

Manage a user's subscriptions.

```javascript
var subscriptions = require('livefyre-subscriptions');
var benSubscriptions = subscriptions.forUser({
    userId: 'ben',
    network: 'go.fyre.co',
    lftoken: 'optional. will use LFTOKEN env variable by default'
});
// or...
var benSubscriptions = subscriptions.forUser('ben@go.fyre.co');
```

When you have a user's subscriptions, there are a few methods you can call that
will perform operations using Livefyre's HTTP APIs. Each of these methods returns a promise.

#### Get subscriptions

```javascript
benSubscriptions.get().then(function (data) {
    console.log(data.subscriptions);
})
```

#### Create a new subscription

```javascript
var newSubscription = {
    to: 'urn:livefyre:demo.fyre.co:site=362588:topic=mlb',
    type: 'personalStream'
};
benSubscriptions.create(newSubscription).then(
    function (data) {
        console.log('success');
    },
    function (e) {
        console.error(e);
    }
);
```

## `make` commands

* `make build` - will `npm install` and `bower install`
* `make dist` - will use r.js optimizer to compile the source, UMD wrap, and place that and source maps in dist/
* `make clean`
* `make server` - serve the repo over http
* `make deploy [env={*prod,uat,qa}]` - Deploy to lfcdn, optionally specifying a bucket env
