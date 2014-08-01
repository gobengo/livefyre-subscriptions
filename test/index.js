var network = 'gobengo.fyre.co';
var subscriptions = require('livefyre-subscriptions');
subscriptions.token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJkb21haW4iOiAiZGVtby5meXJlLmNvIiwgImV4cGlyZXMiOiAxNDA5NDU3MDg3LjIyMjY1NiwgInVzZXJfaWQiOiAic3lzdGVtIn0.VRA5sztE-eWg1TTCG8kMqO7We2ILhhuG8Gc6pxaBOG4'
var assert = require('chai').assert;
var extend = require('util-extend');
var Promise = require('promise');

// var benJid = '_u2012@livefyre.com';
var benJid = 'system@demo.fyre.co';
var mockSubscriptionsClient = {
  getForUser: function (opts) {
    return Promise.resolve({
        "subscriptions": [
          {
            "by": "urn:livefyre:example.fyre.co:user=default",
            "type": "personalStream",
            "to": "urn:livefyre:example.fyre.co:site=23456:topic=123"
          }
        ]
    });
  }
}

// livefyre-subscriptions
describe('.URN', function () {
  it('.forUser(jid)', function() {
    var userUrn = subscriptions.URN.forUser('_u2012@livefyre.com');
    assert.equal(userUrn, 'urn:livefyre:livefyre.com:user=_u2012');
  });
  it('cant .forUser(userId)', function() {
    assert.throws(function () {
      var userUrn = subscriptions.URN.forUser('_u2012');
    })
  });
});

describe('.forUser', function () {
  var benSubscriptions;
  beforeEach(function () {
    benSubscriptions = subscriptions.forUser(benJid)
    // mock the client
    extend(benSubscriptions.client, mockSubscriptionsClient);
  });
  it('gets by jid', function() {
    assert.typeOf(benSubscriptions, 'object');
  });
  it('gets by opts', function () {
    var subs = subscriptions.forUser({
      lftoken: 'omfgomfg',
      userId: 'en',
      network: 'hi.fyre.co'
    })
    assert.typeOf(subs.get, 'function');
  })

  /**
   * Get Subscriptions for a User
   */
  describe('.get', function (){
    this.timeout(10000);
    it('gets a promise', function (done) {
      var getSubs = benSubscriptions.get();
      getSubs.then(yay(done), done);
    });
    it('gets some subscriptions', function (done) {
      benSubscriptions.get()
      .then(function (data) {
        assert.instanceOf(data.subscriptions, Array);
        assert.ok(data.subscriptions.length > 0, 'there are subscriptions');
      })
      .then(yay(done), done);
    });
  })

  /**
   * Add a Subscription for a User
   */
  describe('.create', function () {
    it('gets a promise', function (done) {
      this.timeout(10000)
      var createSub = benSubscriptions.create({
        to: 'urn:livefyre:demo.fyre.co:site=362588:topic=mlb',
        type: 'personalStream'
      });
      createSub
        .then(function (resObj) {
          assert.ok(resObj, 'gets a subscribe response data object');
        })
        .then(yay(done), done);
    });
  })
})

// given a done callback with err as first arg,
// return one that will always be a great success
function yay(done) {
  return done.bind(null, null);
}
