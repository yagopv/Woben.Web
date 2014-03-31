WobenProducts.factory('productService', function($http, $q, productEndPoint) {

    return {
        getById : function(productId) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: productEndPoint + '/Product(' + productId + ')'
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
                url: productEndPoint + '/Product',
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