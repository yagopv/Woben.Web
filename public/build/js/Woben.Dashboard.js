var WobenDashboard = angular.module('WobenDashboard',['ui.router']);

WobenDashboard.config(["$stateProvider", function($stateProvider){
        $stateProvider
            .state('dashboard', {
                url: "/dashboard",
                controller:  "DashboardController",
                templateUrl: "/app/templates/dashboard/index.html",
                resolve: {
                    User: ["$state", "accountService", function($state, accountService) {
                        return accountService.isUserInRole(["User", "Administrator"]).then(
                            function(data) {
                               return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }]
                }
            });
        }]);
WobenDashboard.controller('DashboardController', ["$scope", "User", 

function($scope, User) {
    
    $scope.User = User;
    
}]);

WobenDashboard.controller("DashboardMenuController", ["$scope", "accountService", "ngDialog", 

function($scope, accountService, ngDialog) {

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
WobenDashboard.controller("DashboardAdditionalController", ["$scope", "accountService", 

function($scope, accountService) {

    $scope.User = accountService.User;

    $scope.$on("woben:authenticated", function() {
        $scope.User = accountService.User;
    });
    
}]);
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