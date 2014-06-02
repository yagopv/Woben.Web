var WobenAccount = angular.module('WobenAccount',['ui.router']);

WobenAccount.config(['$stateProvider', function($stateProvider) {
    
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
            })
            .state('confirmAccount', {
                url: "/dashboard/confirmaccount",
                templateUrl: "/app/templates/account/confirmAccount.html",
                controller:    'ConfirmAccountController',
                resolve: {
                    User: ["$state", "accountService", function($state, accountService) {
                        return accountService.isUserInRole(["User"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }]
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
        }]);

WobenAccount.constant("authEndPoint", "https://woben.azurewebsites.net");
WobenAccount.factory('accountService', ['$http','$q','$window','$rootScope', 'baseEndPoint' ,

    function($http, $q, $window, $rootScope, baseEndPoint) {

    var User = function(userData) {
        angular.copy(userData, this);
        this.emailConfirmed = userData.emailConfirmed || userData.isEmailConfirmed;
        this.isAuthenticated = userData.isAuthenticated || true
    }

    var setUserObject = function(userData, token, persistent) {
        var user =  new User(userData);
        if (persistent && token) {
            $window.localStorage.setItem("token", token);
        }
        if (token) {
            $window.sessionStorage.setItem("token", token);
        }
        return user;
    }

    return {
        User : null,

        login : function(data, persistent) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'POST',
                url: baseEndPoint + '/token',
                data : data
            }).success(function(data, status, headers, config) {
                data.roles = data.roles.split(",");
                self.User = setUserObject(data, data.access_token, persistent);
                $rootScope.$broadcast("woben:authenticated");
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        logout : function() {
            var deferred = $q.defer();
            $http({
                method : "POST",
                url : baseEndPoint + "/api/account/logout"
            }).success(function(data, status, headers, config) {
                $window.localStorage.clear("token");
                $window.sessionStorage.clear("token");
                $window.location = "/";
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        register : function(data) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'POST',
                url: baseEndPoint + '/api/account/register',
                data : data
            }).success(function(data, status, headers, config) {
                    deferred.resolve(data);
            }).error(function(error) {
                    deferred.reject(error);
            });
            return deferred.promise;
        },

        userInfo : function() {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/api/account/userinfo'
            }).success(function(data, status, headers, config) {
                    self.User = setUserObject(data, $window.sessionStorage.token, false);
                    $rootScope.$broadcast("woben:authenticated");
                    deferred.resolve(data);
            }).error(function(error) {
                    self.User = setUserObject({
                        isAuthenticated : false
                    }, null, false);
                    deferred.reject(error);
            });
            return deferred.promise;
        },

        isUserInRole : function(roles) {
            var self = this
                deferred = $q.defer();
            if (self.User && self.User.isAuthenticated && self.User.roles.length > 0) {
                angular.forEach(self.User.roles, function(value, key) {
                   if (roles.indexOf(value) != -1) {
                       deferred.resolve(self.User);
                       return deferred.promise;
                   }
                });
                deferred.reject("User don´t have permissions");
                return deferred.promise;
            } else {
                var token = $window.sessionStorage.token;
                if (!token && $window.localStorage.token) {
                    $window.sessionStorage.token = $window.localStorage.token;
                    token = $window.localStorage.token;
                }
                if (!token) {
                    deferred.reject("User don´t have permissions");
                    return deferred.promise;
                }
                self.userInfo().then(
                    function(data) {
                        self.User = setUserObject(data, token, false);
                        angular.forEach(self.User.roles, function(value, key) {
                            if (roles.indexOf(value) != -1) {
                                deferred.resolve(self.User);
                            }
                        });
                        deferred.reject("User don´t have permissions");
                    },
                    function(error) {
                        deferred.reject("User don´t have permissions");
                    }
                )
            }
            return deferred.promise;
        },

		changePassword: function (oldPassword, newPassword, confirmPassword) {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/api/account/changepassword';
            $http({
                method: 'POST',
                url: url,
                data : { oldPassword : oldPassword,
                         newPassword : newPassword,
                         confirmPassword : confirmPassword
                       }
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
		},

		forgotPassword: function (email) {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/api/account/forgotpassword';
            $http({
                method: 'POST',
                url: url,
                data : { eMail : email }
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
		},
		
		resetPassword: function (email, password, confirmPassword, code) {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/api/account/resetpassword';
            $http({
                method: 'POST',
                url: url,
                data : { email : email,
                         password : password,
                         confirmPassword : confirmPassword,
                         code : code
                       }
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
		},


		deleteAccount: function () {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/api/account/deleteaccount';
            $http({
                method: 'POST',
                url: url
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
		},

        sendConfirmationMail : function() {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/api/account/resendconfirmationemail';
            $http({
                method: 'POST',
                url: url
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        initializeAuth : function() {
            var self = this,
                token = $window.sessionStorage.token;
            if (!token && $window.localStorage.token) {
                $window.sessionStorage.token = $window.localStorage.token;
                token = $window.localStorage.token;
            }
            if (!token) {
                return false;
            }
            self.userInfo().then(
                function(data) {
                    self.User = setUserObject(data, token, false);
                }
            )
        }
    }
}]);
WobenAccount.controller('ChangePasswordController', ['$scope', 'accountService', '$state', 'errorService', 

function($scope, accountService, $state, errorService) {

    $scope.disabled = false;
    
    $scope.changePassword = function() {
        $scope.disabled = true;
        accountService.changePassword($scope.oldPassword, $scope.newPassword, $scope.confirmPassword)
            .then(function(data) {
                $scope.disabled = false;
                $scope.modelErrors = null;
                $scope.oldPassword = null;
                $scope.newPassword = null;
                $scope.confirmPassword = null;
                $scope.changePasswordForm.$setPristine();
            }, function(error) {
                $scope.modelErrors = errorService.handleValidationErrors(error);
                $scope.disabled = false;
            })
    }
}]);
WobenAccount.controller('ConfirmAccountController', ['$scope', 'accountService', '$state', 'errorService', 'ngDialog', 

    function($scope, accountService, $state, errorService, ngDialog) {

    $scope.disabled = false;
    $scope.showEmailSent = false;

    $scope.sendConfirmationMail = function() {
        $scope.disabled = true;
        $scope.showEmailSent = false;
        accountService.sendConfirmationMail().then(
            function(data) {
                $scope.showEmailSent = true;
                $scope.disabled = false;
            },
            function(error) {
                $scope.modelErrors = errorService.handleAuthenticationErrors(error);
                $scope.disabled = false;
            }
        );
    }
}]);
WobenAccount.controller('DeleteAccountController', ['$scope', 'accountService', '$state', 'errorService', 'ngDialog',

function($scope, accountService, $state, errorService, ngDialog) {

    $scope.sureToDelete = function() {
        $scope.dialogMessage = "¿Seguro que quieres cancelar tu cuenta?"
        ngDialog.open({
            template : "/app/templates/common/dialogConfirmation.html",
            scope : $scope
        });
    }

    $scope.confirmAction = function() {
        accountService.deleteAccount().then(
            function(data) {
                accountService.logout();
            },
            function(error) {
                $scope.modelErrors = errorService.handleAuthenticationErrors(error);
            }
        )
    }
}]);
WobenAccount.controller('ForgetPasswordController', ['$scope', 'accountService', '$state', 'errorService',

function($scope, accountService, $state, errorService) {
    
    $scope.disabled = true;
    $scope.mailSentSuccess = false;

    $scope.sendConfirmationMail = function() {
        $scope.disabled = true;
        accountService.forgotPassword($scope.email).then(
            function(data) {
                $scope.disabled = false;
                $scope.email = "";
                $scope.mailSentSuccess = true;
                $scope.forgetPasswordForm.$setPristine();
            },function(error) {
                $scope.modelErrors = errorService.handleValidationErrors(error);
                $scope.disabled = false;
            }
        );
    }

    $scope.closeInfo = function() {
        $scope.mailSentSuccess = false
    }

    $scope.modelErrors = null;

    $scope.disabled = false;
}]);
WobenAccount.controller('LoginController', ['$scope', 'accountService', '$state', 'errorService', 

function($scope, accountService, $state, errorService) {
    
        $scope.login = function(stateToGo) {
            $scope.disabled = true;
            accountService.login({
                userName : $scope.userName,
                password : $scope.password,
                grant_type : "password"
            }, $scope.rememberMe).then(
                function(data) {
                    $scope.User = accountService.User;
                    $scope.disabled = false;
                    if (stateToGo) {
                        $state.go(stateToGo);
                    }
                },function(error) {
                    $scope.modelErrors = errorService.handleAuthenticationErrors(error);
                    $scope.disabled = false;
                }
            );
        }

        $scope.rememberMe = false;

        $scope.User = null;

        $scope.modelErrors = null;

        $scope.disabled = false;
}]);
WobenAccount.controller('ResetPasswordController', ['$scope', 'accountService', '$state', '$stateParams', 'errorService', 

function($scope, accountService, $state, $stateParams, errorService) {
    
    $scope.disabled = true;
    $scope.email = $stateParams.email;
    $scope.code = $stateParams.code;
    $scope.resetPasswordSuccess = false;

    $scope.resetPassword = function() {
        $scope.disabled = true;
        accountService.resetPassword($scope.email, $scope.password, $scope.confirmPassword, $scope.code).then(
            function(data) {
                $scope.disabled = false;
                $scope.resetPasswordSuccess = true;
                $scope.resetPasswordForm.$setPristine();
            },function(error) {
                $scope.modelErrors = errorService.handleAuthenticationErrors(error);
                $scope.disabled = false;
            }
        );
    }

    $scope.closeInfo = function() {
        $scope.mailSentSuccess = false
    }

    $scope.modelErrors = null;

    $scope.disabled = false;
}]);