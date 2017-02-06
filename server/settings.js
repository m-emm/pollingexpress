var db = require('./db');
var util = require('util');

function get(req, res) {
  db().then(function(db) {
    console.log('got db, getting settings ');

    db.find({
      _id : 'settings'
    }, function(err, docs) {
      if (err) {
        res.err(err);
      }
      console.log('sending settings');
      res.json(docs);
    });
  });
}

function put(req, res) {
  console.log('putting settings : ' + util.inspect(req));
  db().then(function(db) {
    console.log('got db, settings body = ', util.inspect(req.body));
    if (typeof req.body == 'undefined') {
      req.body = {};
    }
    req.body._id = 'settings';
    console.log('cooked settings body = ', util.inspect(req.body));
    db.update({
      _id : 'settings'
    }, req.body, {}, function(err, numReplaced) {
      if (err) {
        console.log("Error updating settings : " + err);
      } else {
        if (numReplaced == 0) {
          db.insert(req.body, function (err, newDoc) {
            if(err) {
              res.err(err);              
            } else {
              res.json({status: "ok",doc:newDoc});
            }
          });
        } else {
          res.send('ok');
        }
      }
    });
  });
}

function addRoutes(path, router) {
  router.put(path, put);
  router.get(path, get);

}

var service = {
  addRoutes : addRoutes
};
module.exports = service;
