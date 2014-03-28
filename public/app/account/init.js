var WobenAccount = angular.module('WobenAccount',['ui.router']);

WobenAccount.config(function($stateProvider){
        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "app/templates/account/login.html",
                controller:    'LoginController'
            })
            .state('register', {
                url: "/register",
                templateUrl: "app/templates/account/register.html",
                controller:    'RegisterController'
            })
            .state('manage', {
                url: "/manage",
                templateUrl: "app/templates/account/manage.html",
                controller:    'ManageController',
                resolve: {
                    User: function($state, $stateParams, $q, accountService) {
                        return accountService.isUserInRole(["User"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('login');
                            }
                        );
                    }
                }
            });
        });