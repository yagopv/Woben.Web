var WobenDashboard = angular.module('WobenDashboard',['ui.router']);

WobenDashboard.config(function($stateProvider){
        $stateProvider
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "app/templates/dashboard/dashboard.html",
                controller:  "DashboardController",
                resolve: {
                    User: function($state, $stateParams, $q, accountService) {
                        return accountService.isUserInRole(["Administrator"]).then(
                            function(data) {
                               return data;
                            },
                            function(error) {
                                $state.go('dashboard.login');
                            }
                        );
                    }
                }
            })
            .state('dashboard.login', {
                url: "/login",
                controller:  "LoginController",
                templateUrl: "app/templates/dashboard/dashboard.login.html",
            });
        });