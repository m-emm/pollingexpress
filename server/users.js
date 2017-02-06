var db = require('./db');
var util = require('util');
var userUtils = require('./userUtils');
var extend = require('util')._extend;
var Q = require('q');

function get(req, res) {
  var userId = req.params.user_id;

  db().then(function(db) {
    // console.log('got db, getting user '+ userId);

    db.find({
      dbtype : 'user',
      userId : Number(userId)
    }, function(err, docs) {
      if (err) {
        res.status(500).send(err);
      }
      // console.log('got user');
      res.json(docs);
    });
  });
}

function findUserP(userId) {
  var deferred = Q.defer();
  db().then(function(db) {
    // console.log('got db, identifying user '+ userId);
    db.find({
      dbtype : 'user',
      userId : Number(userId)
    }, function(err, docs) {
      console.log("db result received, err: " + err);

      if (err) {
        deferred.reject(err);
      } else{
        if(docs.length>0) {
          deferred.resolve(docs);
        } else {
          deferred.reject("User "+ userId + " not found");
        }
      }
    });
  });
  return deferred.promise;
}

function identifyUser(req, res) {
  console.log('identifyUser');
  var userId = req.params.user_id;

  db().then(function(db) {
    // console.log('got db, identifying user '+ userId);

    db.find({
      dbtype : 'user',
      userId : Number(userId)
    }, function(err, docs) {
      if (err) {
        res.status(500).send(err);
      }
      console.log('got user, storing user id in session');
      userUtils.storeUserId(res,userId);
      res.json(docs);
    });
  });
}


function getAll(req, res) {  

  db().then(function(db) {
    // console.log('got db, getting all users');
    db.find({
      dbtype : 'user'
    }, function(err, docs) {
      if (err) {
        res.status(500).send(err);
      }
      // console.log('got users');
      docs.forEach(function(element){
        if(userUtils.isOnline(element.userId)) {
          element.isOnline = true;
        }
      });
      res.json(docs);
    });
  });
}

function deleteAll(req,res){
  db().then(function(db) {
    db.remove({ dbtype: 'user' }, { multi: true }, function (err, numRemoved) {
    if(err) {
      res.status(500).send(err);    
      } else {
        res.json({status:'ok',numRemoved:numRemoved});      
      }    
  });
  });

}

function SeedRandom(state1,state2){
    
  var mod1=4294967087
  var mul1=65539
  var mod2=4294965887
  var mul2=65537
  if(typeof state1!="number"){
      state1=+new Date()
  }
  if(typeof state2!="number"){
      state2=state1
  }
  state1=state1%(mod1-1)+1
  state2=state2%(mod2-1)+1
  function random(limit){
      state1=(state1*mul1)%mod1
      state2=(state2*mul2)%mod2
      if(state1<limit && state2<limit && state1<mod1%limit && state2<mod2%limit){
          return random(limit)
      }
      return (state1+state2)%limit
  }
  
  function randomInt (low, high) {
    return random(high - low) + low;
  }

  
  return {random:random, randomInt:randomInt};
}


function createUsers(req,res){
  var numUsers = req.params.num_users;
  var newUsers = [];
  var newUserIds = {};
  var randomGenerator = SeedRandom(0);
  for(var i=0;i<numUsers;i++) {
    var userId;
    var ok = false;
    var iter = 0;
    while(!ok && iter < 1000) {
      userId =  randomGenerator.randomInt(1000,9999);
      if(! newUserIds[userId]) {
        ok = true;
      }
    }
    if(!ok) {
      res.status(500).send("Not enough distinct IDs found");
    }
    newUsers.push({dbtype:'user',userId:userId});
    newUserIds[userId] = true;
  }
  db().then(function(db) {
      db.insert(newUsers,function(err, newDocs){
        if(err) {
          res.status(500).send(err);
        } else {
          console.log("successfully inserted "+ newDocs.length + " users");
          res.json(newDocs);
        }
      });
  });
  
}


function getStatus(req,res) {
  var userId = userUtils.identifiedUserId(req);
  var sessionTitle = userUtils.sessionTitle();
   if(userId) {
     res.json({status:'identified',userId:userId,identified:true,sessionTitle:sessionTitle});
   } else {
     var randomGenerator = SeedRandom();
     db().then(function(db) {
       var userId =  randomGenerator.randomInt(1000,999999);
       db.insert({dbtype:'user',userId:userId},function(err, newDocs){
         if(err) {
           res.status(500).send(err);
         } else {
           userUtils.storeUserId(res,userId);
           console.log("successfully inserted new user with id "+ userId);
           res.json({status:'identified',userId:userId,identified:true,sessionTitle:sessionTitle});
         }
       });
     });
     
     
   }
}

function logout(req,res) {
  var userId = userUtils.identifiedUserId(req);
  if(userId) {
    userUtils.removeUser(res);
    res.json({status:'logged out'});
  } else {
    res.json({});
  }
}

function identifyUserExt(req,res) {
  var userId = Number(req.params.user_id);
  findUserP(req.params.user_id).then(function(data){
    userUtils.storeUserId(res,userId);
    res.redirect('/');
    res.send(data);
  },function(err){
    userUtils.removeUser(res);
    res.redirect('/');
  });
}


function addRoutes(path, router) {
  router.post(path+'/identify/:user_id', identifyUser);
  router.get(path+'/status', getStatus);
  router.post(path+'/logout', logout);
  router.get(path, getAll);
  router.delete(path, deleteAll);
  router.post(path+'/createUsers/:num_users', createUsers);  
  router.get(path+'/:user_id', get);
  
}

var service = {
    addRoutes : addRoutes,
    identifyUserExt: identifyUserExt
  };
  module.exports = service;
