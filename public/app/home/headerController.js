Woben.controller("HeaderController", function($scope, accountService, $timeout, $state, $window) {

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

});