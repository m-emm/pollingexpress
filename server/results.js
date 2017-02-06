var db = require('./db');
var util = require('util');
var userUtils = require('./userUtils');
var _ = require('lodash');

function getResults(req, res) {
  var numOnlineUsers = userUtils.numOnlineUsers();
  db().then(function(db) {
    // console.log('got db, getting results');
    db.find({
      $or : [ {
        dbtype : 'poll'
      }, {
        dbtype : 'vote'
      } ]
    }, function(err, docs) {
      if (err) {
        res.status(500).send(err);
      } else {
        var polls = _.filter(docs, {
          dbtype : 'poll'
        });
        var retval = [];
       // console.log("Found polls : " + util.inspect(polls));
        polls.forEach(function(element) {
          var votes = _.filter(docs, {
            dbtype : 'vote',
            pollId : element._id
          });
          var pollResult = {
            poll : element
          };
          if (element.showResults) {
            pollResult.result = _.countBy(votes, 'result');
          } else {
            pollResult.numVotes = votes.length;
          }
          pollResult.numOnlineUsers = numOnlineUsers;
          retval.push(pollResult);
        });

        res.json(retval);
      }
    });
  });
}

function addRoutes(path, router) {
  router.get(path, getResults);
}

var service = {
  addRoutes : addRoutes
};
module.exports = service;
