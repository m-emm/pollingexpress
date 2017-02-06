export default function($location, $scope, $rootScope) {

		var vm = this;
		vm.isSelected = isSelected;
		vm.isActive = isActive;
		vm.isNavigationVisible = isNavigationVisible;
		vm.activate = activate;
		vm.go = go;
		vm.reservationActive = false;


		$rootScope.$on("$routeChangeStart", function(event, next, current) {
			routeUpdate();
		});
		
		$rootScope.$on("$locationChangeSuccess", function(event, next, current) {
			routeLanded();
		});

			initTabs();
		
		function routeLanded() {
			if(typeof ga != "undefined") {
			}
		}

		function initTabs() {
			
			vm.tabs = [];
			vm.tabs.push({
				id : 0,
				title : "OVERVIEW",
				route : "overview",
				navigationVisible : true
			});			
			vm.tabs.push({
				id : 1,
				title : 'OBJECTVIEW',
				route : "objectview",
				navigationVisible : true
			});		
			

			vm.tabsByRoute = {};
			vm.tabs.forEach(function(tab) {
				vm.tabsByRoute['/' + tab.route] = tab;
			});
			activate(vm.tabs[0]);
		}

		function activate(tab) {		
			vm.activeTab = tab.id;			
		}

		function isSelected(candidate) {
			return candidate.id == vm.activeTab;
		}

		function isActive(tabRoute) {
			return ('/' + tabRoute) === $location.path();
		}

		function routeUpdate() {
			if (vm.tabsByRoute) {
				var tab = vm.tabsByRoute[$location.path()];
				if (null != tab) {
					activate(tab);
				}
			}
		}

		function isNavigationVisible() {
		  ///////////////////////////////
		  
		  return false;
			
		  
		  
		  if(vm.tabs) {
				return vm.tabs[vm.activeTab].navigationVisible;
			}
			return true;
		}

		function go(path) {
			$location.path(path);
		}

		routeUpdate();

	}