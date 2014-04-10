WobenDashboard.controller("DashboardHeaderController", function($scope, accountService) {

    $scope.$on("woben:authenticated", function() {
        $scope.User = accountService.User;
        $scope.userName = "@" + $scope.User.userName;
    });

    $scope.logout = function() {
        accountService.logout();
    }
});