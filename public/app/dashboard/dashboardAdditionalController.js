WobenDashboard.controller("DashboardAdditionalController", function($scope, accountService) {

    $scope.User = accountService.User;

    $scope.$on("woben:authenticated", function() {
        $scope.User = accountService.User;
    });
});