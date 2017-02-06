import Datastore from '../../bower_components/nedb/browser-version/out/nedb.js';


export default function($q) { 

  function initDb() {
var db = new Datastore({ filename: 'test77'} );
var deferred = $q.defer();

db.loadDatabase (function (err) {    // Callback is optional
  if(err) {
    deferred.reject(err); 
  } else {
    deferred.resolve(db);
  }
}
);

var doc = { hello: 'world'
  , n: 5
  , today: new Date()
  , nedbIsAwesome: true
  , notthere: null
  , notToBeSaved: undefined  // Will not be saved
  , fruits: [ 'apple', 'orange', 'pear' ]
  , infos: { name: 'nedb' }
  };
  

return deferred.promise;

} 
var service = {
    initDb : initDb    
};

return service;

}