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

        add : function(product) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'POST',
                url: productEndPoint + '/Product',
                data : product
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        
        update : function(product) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'PUT',
                url: productEndPoint + '/Product(' + product.productId + ')',
                data : product
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }        
    }
});