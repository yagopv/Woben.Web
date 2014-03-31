WobenProducts.factory('categoryService', function($http, $q, productEndPoint) {

    return {
        getAll : function() {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: productEndPoint + '/Category'
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
                url: productEndPoint + '/Category(' + productId + ')'
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
                url: productEndPoint + '/Category',
                data : data
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
});