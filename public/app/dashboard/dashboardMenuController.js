WobenDashboard.controller("DashboardMenuController", ["$scope", "accountService", "ngDialog", function($scope, accountService, ngDialog) {

    $scope.User = accountService.User;

    $scope.addProduct = function() {
        ngDialog.open({
            template: "/app/templates/products/addProduct.html",
            controller : "AddProductController",
            scope: $scope
        });
    }

    $scope.$on("woben:authenticated", function() {
        $scope.User = accountService.User;
    });
}]);