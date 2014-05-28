WobenContact.factory('messageService', ["$http", "$q", "$cacheFactory", "baseEndPoint", "$window",
    function($http, $q, $cacheFactory, baseEndPoint, $window) {

    return {
        getAll : function(query) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Message' + (query ? "?" + query : ""),
                cache : true
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getById : function(messageId) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Message(' + messageId + ')'
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        add : function(message) {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/odata/Message';
            $http({
                method: 'POST',
                url: url,
                data : message
            }).success(function(data, status, headers, config) {
                $cacheFactory.get("$http").removeAll();
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        
        update : function(message) {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/odata/Message(' + message.messageId + ')'
            $http({
                method: 'PUT',
                url: url,
                data : message
            }).success(function(data, status, headers, config) {
                $cacheFactory.get("$http").removeAll();
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        delete : function(messageId) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'DELETE',
                url: baseEndPoint + '/odata/Message(' + messageId + ')'
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }       
    }
}]);