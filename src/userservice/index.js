var exportdefault = function($http) {
  
  
  function identifyUser(userId) {
    return $http.post('app/api/users/identify/'+userId,{}).then(function(data) {
      service.userInfo = data.data;
      service.identifiedUser = service.userInfo.userId;
    },function() {
      service.identifiedUser = null;
      console.log("Error identifying user");
    });
  }
  
  function getloginStatus(userId) {
    return $http.get('app/api/users/status').then(function(data) {
      service.loginStatus = data.data;      
    },function() {
      service.loginStatus = null;
      console.log("getting login status");
    });
  }
  
  function logout() {
    return $http.post('app/api/users/logout',{}).then(function(data){
      service.loginStatus = {};
    }); 
  }
   
  
  function postVote(vote) {
      return $http.post('/app/api/votes',vote).then(function(data) {
        service.voteResult = data.data;
      },function() {
        console.log("Error voting");
      });
    }
  
  var service = {
      identifyUser : identifyUser,
      postVote : postVote,
      getloginStatus:getloginStatus,
      logout:logout,
      identifiedUser: null
  };
  
  
  return service;
}

export default exportdefault;
