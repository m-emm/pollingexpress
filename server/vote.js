var db = require('./db');
var util = require('util');
var userUtils = require('./userUtils');

function postVote(req,res) {
  // console.log("Posting vote, vote content: " + util.inspect(req.body) );
  var userId = userUtils.identifiedUserId(req);

  if(!userId) {
    console.log("user not identified, sending 500");
    res.status(500).send('user not identified');
  } else {
    // console.log("vote post: getting DB..");
    db().then(function(db) {
      // console.log("vote post: got DB");
      var vote = req.body;
      vote.voteUserId = userId;
      vote.dbtype = 'vote';      
      vote.timestamp = new Date();
      // console.log("Got db, inserting vote " + util.inspect(vote));
      db.insert(vote, function (err, newDoc) {
          if(err) {
            console.log("Error inserting vote: " + err);
            res.status(500).send({status:'error',error:err});
          } else {
            res.json({status:'ok', action:'vote registered', voteId: newDoc._id});
          }
      });
      
    });    
  }
}

function getAllVotes(req, res) {

  db().then(function(db) {
    // console.log('got db, getting all votes');

    db.find(  { dbtype: 'vote' }, function(err, docs) {
      if (err) {
        res.status(500).send(err);
      }
      // console.log('got votes : ' + util.inspect(docs));
      res.json(docs);
    });
  });
  
}


function deleteAll(req,res){
  db().then(function(db) {
    db.remove({ dbtype: 'vote' }, { multi: true }, function (err, numRemoved) {
    if(err) {
      res.status(500).send(err);    
      } else {
        res.json({status:'ok',numRemoved:numRemoved});      
      }    
  });
  });

}

function addRoutes(path, router) {
  router.get(path, getAllVotes);  
  router.post(path, postVote);    
  router.delete(path, deleteAll);
}

var service = {
    addRoutes : addRoutes
  };
  module.exports = service;
