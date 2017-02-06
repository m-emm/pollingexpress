require('./index.html');

var exportdefault = function($routeParams, $location, $interval, pollservice) {
  var vm = this;


  vm.label = "Results";
  vm.results = [];
  $interval(onReload,5000);
  onReload();
  
  function onReload() {
    pollservice.getResults().then(function() {
   
      vm.results = pollservice.results;
      vm.results.forEach(function(element){
      if(element.poll.showResults) {  
      
        var tally = [];
        var totalVotes = 0;
        for(var i=0;i<element.poll.options.length;i++) {
            var numVotes = 0;            
            if(element.result && element.result[i] ) {
                numVotes = element.result[i];              
            }
            var tallyStyle = {};
            var styleText = '' + ( 20* (numVotes) + 10) + 'px';                
            tallyStyle['width'] = styleText;            
            tallyStyle['background-color'] = 'powderblue';
           
            tally.push({text:element.poll.options[i],numVotes:numVotes,style:tallyStyle});
            totalVotes += numVotes;
            
        } 
        element.tally = tally;
        element.totalVotes = totalVotes;       
        } 
      var numVoteStyle = {};
      var totalStyleText = '' + ( 10* (element.numVotes) + 10) + 'px';                
      numVoteStyle['width'] = totalStyleText;            
      numVoteStyle['background-color'] = 'powderblue';
      console.log(numVoteStyle);
      element.numVoteStyle = numVoteStyle;        
      });
      
     
      });
   
  }



}

export default exportdefault;