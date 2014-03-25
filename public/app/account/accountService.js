Woben.factory('accountService', function($http, $q, $window, $rootScope, $state) {

    var baseUrl = "https://woben.azurewebsites.net";

    var User = function(userData) {
        this.userName = userData.userName;
        this.token = userData.access_token;
        this.roles = userData.roles;
        this.emailConfirmed = userData.emailConfirmed || userData.isEmailConfirmed;
        this.isAuthenticated = userData.isAuthenticated || true;
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
                url: baseUrl + '/token',
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
                url : baseUrl + "/api/account/logout"
            }).success(function(data, status, headers, config) {
                $window.localStorage.clear("token");
                $window.sessionStorage.clear("token");
                $window.location.reload();
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
                url: baseUrl + '/api/account/register',
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
                url: baseUrl + '/api/account/userinfo'
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
});