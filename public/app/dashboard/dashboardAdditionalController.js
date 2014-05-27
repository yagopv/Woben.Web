WobenDashboard.controller("DashboardAdditionalController", ["$scope", "accountService", 

function($scope, accountService) {

    $scope.User = accountService.User;

    $scope.$on("woben:authenticated", function() {
        $scope.User = accountService.User;
    });
    
}]);