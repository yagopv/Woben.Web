var WobenHome = angular.module('WobenHome',['WobenAccount']);
WobenHome.controller("HomeController", ["$scope", "$window",

function($scope, $window) {
    
    startupKit.uiKitHeader.header10();
    
}]);
WobenHome.controller("HeaderController", ["$scope", "accountService", "$timeout", "$state", "$window",

    function($scope, accountService, $timeout, $state, $window) {

        $scope.User = accountService.User;

        $scope.$on("woben:authenticated", function() {
            $scope.User = accountService.User;

            // Wait for next digest cycle
            $timeout(function() {
                angular.element(document.getElementById("header-10")).remove();
                startupKit.uiKitHeader.header10();
            });
        });

        $scope.logout = function() {
            accountService.logout();
        }

        $scope.$state = $state;

}]);
WobenHome.controller("FooterController", ["$scope", function($scope) {

}]);