var WobenAccount = angular.module('WobenAccount',['ui.router']);

WobenAccount.config(function($stateProvider){
        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "/app/templates/account/login.html",
                controller:    'LoginController'
            })
            .state('register', {
                url: "/register",
                templateUrl: "/app/templates/account/register.html",
                controller:    'RegisterController'
            })
            .state('changePassword', {
                url: "/dashboard/changePassword",
                templateUrl: "/app/templates/account/changePassword.html",
                controller:    'ChangePasswordController',
                resolve: {
                    User: function($state, $stateParams, $q, accountService) {
                        return accountService.isUserInRole(["User", "Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }
                }
            })
            .state('forgetPassword', {
                url: "/forgetPassword",
                templateUrl: "/app/templates/account/forgetPassword.html",
                controller:    'ForgetPasswordController'
            })
            .state('resetPassword', {
                url: "/resetPassword?email&code",
                templateUrl: "/app/templates/account/resetPassword.html",
                controller:    'ResetPasswordController'
            })            
            .state('deleteAccount', {
                url: "/dashboard/deleteAccount",
                templateUrl: "/app/templates/account/deleteAccount.html",
                controller:    'DeleteAccountController',
                resolve: {
                    User: function($state, $stateParams, $q, accountService) {
                        return accountService.isUserInRole(["User", "Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }
                }                
            })
            .state('confirmAccount', {
                url: "/dashboard/confirmaccount",
                templateUrl: "/app/templates/account/confirmAccount.html",
                controller:    'ConfirmAccountController',
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
            })
            .state('registrationComplete', {
                url: "/registrationcomplete",
                templateUrl: "/app/templates/account/registrationComplete.html"
            })
            .state('signin', {
                url: "/dashboard/signin",
                controller:  "LoginController",
                templateUrl: "/app/templates/dashboard/signin.html"
            });
        });

WobenAccount.constant("authEndPoint", "https://woben.azurewebsites.net");