WobenProducts.factory('categoryService', ["$http", "$q", "baseEndPoint", 

function($http, $q, baseEndPoint) {

    return {
        getAll : function(query) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Category' + (query ? "?" + query : "")
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        
        getById : function(categoryId) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Category(' + productId + ')'
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        add : function(data) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'POST',
                url: baseEndPoint + '/odata/Category',
                data : data
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
}]);