var exportdefault = function($http) {
  
  function getPolls(userId) {
     return $http.get('app/api/polls/').then(function(data) {
        service.polls = data.data;
      },function() {
        console.log("Error getting polls");
      });
  }
 
  function deleteUsers() {
    return $http.delete('app/api/users').then(function(data) {
      service.users = [];
    });
  }
  
  function deletePolls() {
    return $http.delete('app/api/polls').then(function(data) {
      service.polls = [];
    });
  }
  
  function deleteVotes() {
    return $http.delete('app/api/votes').then(function(data) {
      service.votes = [];
    });
  }

  
  function getUsers() {
    return $http.get('app/api/users/').then(function(data) {
      service.users = data.data;
    },function() {
      console.log("Error getting users");
    });
  }
  
  function createUsers(numUsers) {
    return $http.post('/app/api/users/createUsers/'+numUsers,{}).then(function(data) {
      service.createUsersResult = data.data;
    },function() {
      console.log("Error creating users");
    });
  }
   
  function create(vote) {
      return $http.post('/app/api/users/vote',vote).then(function(data) {
        service.voteResult = data.data;
      },function() {
        console.log("Error voting");
      });
    }
  
  var service = {
      getPolls : getPolls,
      deleteVotes:deleteVotes,
      deletePolls:deletePolls,
      identifiedUser: null,
      getUsers:getUsers,
      deleteUsers:deleteUsers,
      createUsers:createUsers
  };
  
  
  return service;
}

export default exportdefault;
