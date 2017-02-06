var db = require('./db');
var util = require('util');
var userUtils = require('./userUtils');
var _ = require('lodash');


function currentPoll(req, res) {
  var userId = userUtils.identifiedUserId(req);
  if(!userId) {
    res.status(409).send("User not identified in this session");
  } else {
    
  db().then(function(db) {
    // console.log('got db, current poll for user '+ userId);

    db.find( { $or: [{ dbtype: 'poll', active:true }, { dbtype: 'vote', voteUserId:userId } , {dbtype:'user', userId:userId }]}, function(err, docs) {
      if (err) {
        res.status(500).send(err);
      }
      var userFound = false;
      docs.forEach(function(element){
        if(element.dbtype == 'user') {
          userFound = true;
        }        
      });
      if(!userFound) {
        userUtils.removeUser(res);
        res.status(500).send("Unknown user " + userId);
        return;
      }

      var voteResult = {};     
      docs.forEach(function(element){
        if(element.dbtype == 'vote') {
          voteResult[element.pollId] = { voted: true, voteResult: element.result};
        }        
      });
      // console.log("Vote results: " + util.inspect(voteResult));
      var retval = [];
      docs.forEach(function(element){
        if(element.dbtype == 'poll') {
          if(voteResult[element._id]) {
            element.alreadyVoted = true;
            element.voteResult = voteResult[element._id].voteResult; 
          }
          if(element.options) {
            var cookedOptions = [];
            var i =0;
            element.options.forEach(function(element){
                cookedOptions.push({id: i++, text:element});
            });
            element.options = cookedOptions;            
          }
          retval.push(element);
        }        
      });
      
//       console.log('got polls and votes: ' + util.inspect(docs));
//      console.log('sending polls and votes: ' + util.inspect(retval));
      res.json(retval);
    });
  });
  }
}

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

function getAllPolls(req, res) {

  db().then(function(db) {
    console.log('got db, getting all polls');

    db.find(  { dbtype: 'poll' }, function(err, docs) {
      if (err) {
        res.status(500).send(err);
      }
      // console.log('got polls : ' + util.inspect(docs));
      res.json(docs);
    });
  });
  
}


function newPoll(req,res) {
  console.log("Adding new poll: " + util.inspect(req.body) );
    db().then(function(db) {
      console.log("new poll post: got DB");
      var poll = req.body;
      
      poll.dbtype = 'poll';  
      if(poll.active) {
        poll.active = true;
      }      
      poll.creationtime = new Date();
      console.log("Got db, inserting poll " + util.inspect(poll));
      db.insert(poll, function (err, newDoc) {
          if(err) {
            console.log("Error inserting poll: " + err);
            res.status(500).send({status:'error',error:err});
          } else {
            res.json({status:'ok', action:'poll registered', pollId: newDoc._id});
          }
      });
      
    });    
  
}

function deleteAll(req,res){
  db().then(function(db) {
    db.remove({ dbtype: 'poll' }, { multi: true }, function (err, numRemoved) {
    if(err) {
      res.status(500).send(err);    
      } else {
        res.json({status:'ok',numRemoved:numRemoved});      
      }    
  });
  });

}

function updatePoll(req, res) {
  console.log('update poll ' + req.body._id);
  db().then(function(db) {
    db.update({_id:req.body._id},req.body,{},function(err,numReplaced) {
        if(err) {
          res.status(500).send(err);    
        } else {
          res.json({status:'ok',numReplaced:numReplaced});   
        }
    });
  });

}


function addRoutes(path, router) {
  router.get(path, getAllPolls);
  router.get(path+'/currentPoll', currentPoll);
  router.post(path+'/vote', postVote);
  router.post(path,newPoll);
  router.put(path+'/:poll_id',updatePoll);
  router.delete(path, deleteAll);  
}

var service = {
    addRoutes : addRoutes
  };
  module.exports = service;
