require('./index.html');

var exportdefault = function($routeParams, $location, $timeout, pollservice,adminservice,$interval,$q) {
  var vm = this;

  vm.onSavePoll = onSavePoll;
  vm.onSaveAllPolls = onSaveAllPolls;
  vm.onSelectOptionTemplate = onSelectOptionTemplate;
  vm.onNewPoll = onNewPoll;
  vm.onCreateUsers = onCreateUsers;
  vm.onDeleteUsers = onDeleteUsers;
  vm.onDeleteAllPolls = onDeleteAllPolls;
  vm.onDeleteAllVotes = onDeleteAllVotes;

  
  vm.label = "Admin";
  vm.polls = [];
  vm.optionsTemplates = {};
  vm.optionsTemplates.yesNo = [ "yes", "no" ];
  vm.optionsTemplates.yesNoDontKnow = [ "yes", "no", "don't know" ];
  vm.optionsTemplates.agreement3 = [ "I agree", "no opinion", "I disagree" ];
  vm.optionsTemplates.agreement4 = [ "I strongly agree", "I agree", "I disagree", "I strongly disagree" ];
  vm.optionsTemplates.agreement5 = [ "I strongly agree", "I agree", "no opinion", "I disagree", "I strongly disagree" ];

  vm.optionsTemplates.feel = [ "full of energy", "good", "I'm unsure", "afraid", "angry", "disappointed", "sad" ];
  vm.optionsTemplates.fibo89 = [ "1",  "2", "3", "5" ,"8", "13" , "21" , "34" , "55", "89" ];
  vm.optionsTemplates.fibo377 = [ "1",  "2", "3", "5" ,"8", "13" , "21" , "34" , "55", "89","144","233","377" ];

  vm.optionsTemplatesList = [];
  vm.selectedTemplate = {};

  for ( var key in vm.optionsTemplates) {
    var template = vm.optionsTemplates[key];
    vm.optionsTemplatesList.push({
      template : key,
      options : template
    });
  }
  onReload();
  $interval(onReloadUsers,15000);
  onReloadUsers();
  
  
  function onReload() {
    pollservice.getAllPolls().then(function() {

      vm.polls = pollservice.polls;
      vm.polls.forEach(function(element) {
        if (element.optionsTemplate) {
          vm.selectedTemplate[element._id] = element.optionsTemplate;
        }
      });
      vm.polls = _.sortBy(vm.polls,function(o){ if(o.creationtime) { return - (new Date(o.creationtime).getTime());} return o.title; } );

    },function(err) {
      vm.err = err;
      vm.polls = [];
    });
  }
  
  function onReloadUsers() {
      adminservice.getUsers().then(function(){
          vm.users = adminservice.users;
          vm.users = _.sortBy(vm.users,'userId');
          vm.userCount= {all:vm.users.length,online:_.countBy(vm.users,'isOnline').true};
          vm.userCount = vm.userCount || "0";
          vm.users.forEach(function(element){
            var portpart = '';
            if($location.port() !== 80) {
              portpart = ':'+  $location.port() ;
            }
            element.loginUrl = $location.protocol() + '://'+ $location.host() + portpart + '/u/'+element.userId;
          });
          
      });
  }

  function onSavePoll(pollId) {
    vm.polls.forEach(function(element) {
      if (element._id == pollId) {
        element.options = vm.optionsTemplates[vm.selectedTemplate[pollId]];
        element.optionsTemplate = vm.selectedTemplate[pollId];
        if (element._id == 'new') {
          delete element._id;
        }
        pollservice.updatePoll(element).then(onReload);
      }
    });
  }
  
  function onSaveAllPolls() {
    var promises = [];
    vm.polls.forEach(function(element) {      
        element.options = vm.optionsTemplates[vm.selectedTemplate[element._id]];
        element.optionsTemplate = vm.selectedTemplate[element._id];
        if (element._id == 'new') {
          delete element._id;
        }
        promises.push(pollservice.updatePoll(element));;      
    });
    $q.all(promises).then(onReload);
  }

  function onNewPoll() {
    vm.polls.unshift({
      _id : 'new'
    });
  }

  function onSelectOptionTemplate(pollId, template) {
    vm.selectedTemplate[pollId] = template;
  }
  
  function onCreateUsers() {
     if(vm.numUsers > 0) {
         adminservice.createUsers(vm.numUsers).then(onReloadUsers);
     }
  }
  
  function onDeleteUsers() {    
        adminservice.deleteUsers().then(onReloadUsers);   
 }

  function onDeleteAllPolls() {    
    adminservice.deletePolls().then(onReload);   
  }


  function onDeleteAllVotes() {    
    adminservice.deleteVotes().then(onReload);   
  }

  

}

export default exportdefault;