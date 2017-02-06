var moment = require('moment');
var _ = require('lodash');
var online = {};

function identifiedUserId(req) {
  if( req.cookies && req.cookies.userId ) {
    var userId = Number(req.cookies.userId);
    online[userId] = new moment();
    return userId;
  }
  return null;
} 

function storeUserId(res,userId) {
    res.cookie('userId',userId,{maxAge:3*1000*86400 });
}

function removeUser(res) {
  res.clearCookie('userId');
}

function isOnline(userId) {
  var checkpoint = moment().subtract(1,'minutes');
  if(online[userId] ) {
    var checkpoint = moment().subtract(1,'minutes');
    return online[userId].isAfter(checkpoint);
  }
  return false;
}

function numOnlineUsers() {
  var checkpoint = moment().subtract(1,'minutes');

    var numUsers = _.reduce(online,function(result,value,key){
        if(value.isAfter(checkpoint)) {
          result = result + 1;
        }
        return result;
    },0);
    return numUsers;
}

function sessionTitle() {
  return "Polling Session";
}



var service = {
    identifiedUserId:identifiedUserId,
    sessionTitle:sessionTitle,
    storeUserId:storeUserId,
    removeUser:removeUser,
    numOnlineUsers:numOnlineUsers,
    isOnline: isOnline
};


module.exports = service;

