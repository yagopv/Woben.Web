var WobenDashboard = angular.module('WobenDashboard',['ui.router']);

WobenDashboard.config(function($stateProvider){
        $stateProvider
            .state('dashboard', {
                url: "/dashboard",
                controller:  "DashboardController",
                templateUrl: "/app/templates/dashboard/index.html",
                resolve: {
                    User: function($state, $stateParams, $q, accountService) {
                        return accountService.isUserInRole(["User"]).then(
                            function(data) {
                               return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }
                }
            });
        });