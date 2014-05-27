WobenDashboard.controller("DashboardHeaderController", ["$scope", "accountService", 

function($scope, accountService) {

    $scope.$on("woben:authenticated", function() {
        $scope.User = accountService.User;
        $scope.userName = "@" + $scope.User.userName;
    });

    $scope.logout = function() {
        accountService.logout();
    }
}]);