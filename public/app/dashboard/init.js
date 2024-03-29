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