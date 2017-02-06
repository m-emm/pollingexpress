
var Q = require('q');
var Datastore = require('nedb');

var initDeferred = Q.defer();

function initDb() {
	var db = new Datastore({
		filename : 'data/expresspoll.db'
	});
	console.log("initializing DB");
	db.loadDatabase(function(err) {
		if (err) {
		  console.log("DB: Error: " + err);
			initDeferred.reject(err);
		} else {
	    console.log("DB initialized, adding index");      
		  db.ensureIndex({ fieldName: 'userId', unique: false }, function(err) {
		    if(err){
		      initDeferred.reject(err);
		    } else {
		      console.log("Index added");
		      initDeferred.resolve(db);    
		    }
		  });		  
		}
	});
}

function db() {
  return initDeferred.promise;
} 


initDb();

module.exports = db;

