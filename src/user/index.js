require('./index.html');

var exportdefault = function($routeParams, $location, $timeout, $interval, userservice, pollservice) {
  var vm = this;
  vm.label = "Poll";
  vm.userId = $routeParams.id;
  vm.userIdentified = false;
  vm.postVote = postVote;
  vm.login = login;
  vm.vote = vote;
  vm.onLogout = onLogout;
  vm.onSelectPollOption = onSelectPollOption;
  vm.pollResults = {};

  updateLoginStatus();
  $interval(updateActivePolls, 5000);

  function updateActivePolls() {
    if (vm.userIdentified) {
      pollservice.getActivePolls().then(function() {
        $timeout(function() {
          vm.online = true;
          vm.toggler = ! vm.toggler;
          vm.activePolls = pollservice.activePolls;
          vm.activePolls.forEach(function(element) {
            if (element.alreadyVoted) {
              vm.pollResults[element._id] = element.voteResult;
            }

          });
          vm.activePolls = _.sortBy(vm.activePolls,function(o){ if(o.creationtime) { return - (new Date(o.creationtime).getTime());} return o.title; } );
        });
      },function(){
        vm.online = false;
        vm.activePolls = [];
      });
    }
  }

  function updateLoginStatus() {
    userservice.getloginStatus().then(function() {
      if (userservice.loginStatus && userservice.loginStatus.identified) {
        vm.userIdentified = true;
        vm.userId = userservice.loginStatus.userId;
        vm.sessionTitle = userservice.loginStatus.sessionTitle;
        updateActivePolls();
      }
    });
  }

  function login() {
    if (vm.userId) {
      userservice.identifyUser(vm.userId).then(function() {
        vm.userInfo = userservice.userInfo;
        updateLoginStatus();
      });
    }
  }

  function postVote() {
    userservice.postVote({
      yesOrNo : 'yes'
    });
  }

  function onSelectPollOption(pollId, pollOptionId) {
    var alreadyVoted = false;
    vm.activePolls.forEach(function(element) {
      if (element._id == pollId && element.alreadyVoted) {
        alreadyVoted = true;
      }
    });
    if (!alreadyVoted) {
      vm.pollResults[pollId] = pollOptionId;
    }
  }

  function vote(pollId) {
    var vote = {
      pollId : pollId
    };
    vote.result = vm.pollResults[pollId];
    userservice.postVote(vote).then(function() {
      updateActivePolls()
    });
  }
  
  function onLogout() {
    userservice.logout().then(function(){
      vm.activePolls= [];
      vm.userIdentified = false;
      vm.userId =null;
      updateLoginStatus();
    });
  }

}

export default exportdefault;