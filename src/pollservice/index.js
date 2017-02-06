var exportdefault = function($http) {
  
  function getActivePolls() {
    return $http.get('/app/api/polls/currentPoll').then(function(data) {
      service.activePolls = data.data;      
    },function() {
      console.log("Error getting current polls");
      throw "Error getting current polls";
    });
  }
  
  function getResults() {
    return $http.get('/app/api/results').then(function(data) {
      service.results = data.data;
    },function() {
      console.log("Error getting results");
    });
  }
  
  function getAllPolls() {
    return $http.get('/app/api/polls').then(function(data) {
      service.polls = data.data;
    },function() {
      console.log("Error getting all polls");
    });
  }
  
  
  function updatePoll(poll) {
    if (!poll._id) {
      return $http.post('/app/api/polls', poll).then(function(data) {
        service.poll = data;
      },function() {
        console.log("Error creating poll");
      });
    } else {
      return $http.put('/app/api/polls/' + poll._id, poll).then(function(data) {
        service.pull= data;
      },function() {
        console.log("Error updating poll");
      });
    }
  }
  
   
  function postVote(vote) {
      return $http.post('/app/api/votes',vote).then(function(data) {
        service.voteResult = data.data;
      },function() {
        console.log("Error voting");
      });
    }
  
  
  var service = {
      postVote : postVote,
      getActivePolls:getActivePolls,
      getAllPolls:getAllPolls,
      updatePoll:updatePoll,
      getResults:getResults
  };
  
  
  return service;
}

export default exportdefault;
