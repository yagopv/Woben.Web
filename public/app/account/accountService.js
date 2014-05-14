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