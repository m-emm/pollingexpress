require('./index.html');

var exportdefault = function($routeParams, $location, $timeout, persistenceService) {
	var vm = this;
	vm.label = "locations";

	vm.form = [ "*", {
		type : "submit",
		title : "Save"
	} ];
	vm.model = {};
	vm.schema = {
		type : "object",
		properties : {
			name : {
				type : "string",
				minLength : 2,
				title : "Name",
				description : "Name or alias"
			},
			type : {
				type : "string",
				enum : [ 'Room', 'Shelf', 'Cupboard', 'Building' ]
			}
		}
	};

	persistenceService.initDb().then(function(db) {
		vm.db = db;
		loadAll();
	});

	vm.store = store;
	vm.load = load;
	vm.loadAll = loadAll;
	vm.onNew = onNew;
	vm.onSubmit = onSubmit;
	vm.onEdit = onEdit;

	function onEdit(id) {
		if (vm.loaded) {
			vm.model = angular.copy(vm.loaded.find(function(element) {
				return element._id == id;
			}));
			vm.editingId = id;
		}
	}

	function store() {
		var doc = {
			text : vm.text
		};
		vm.db.insert(doc, function(err, newDoc) {
			vm.id = newDoc._id;
			console.log("Stored doc with id " + vm.id);
		});
	}

	function load() {
		if (vm.id) {
			vm.db.findOne({
				_id : vm.id
			}, function(err, doc) {
				if (doc && doc.text) {
					vm.text = doc.text;
				}
				// doc is the document Mars
				// If no document is found, doc is null
			});
		}
	}

	function onNew() {
		vm.editingId = '__new';
		vm.model = {};
	}

	function onSubmit(form) {
		if (vm.model.name) {
			vm.model._type = 'location';
			if (vm.editingId == '__new') {
				vm.db.insert(vm.model, function(err, newDoc) {
					if (err) {
						console.log("Error inserting: " + err);
					}
					vm.id = newDoc._id;
					console.log("Stored doc with id " + vm.id);
				});
			} else {
				vm.db.update({
					_id : vm.model._id
				}, vm.model, {}, function(err, newDoc) {
					if (err) {
						console.log("Error updating doc with id "
								+ vm.model._id + " : " + err);
					} else {
						loadAll();
					}
				});
			}

			vm.editingId = null;
		}

	}

	function loadAll() {
		vm.db.find({
			_type : 'location'
		}, function(err, docs) {
			$timeout(function() {
				vm.loaded = docs;
			});
		});
	}

}

export default exportdefault;