WobenProducts.factory('productService', ["$http", "$q", "$cacheFactory", "baseEndPoint", "$window", 

function($http, $q, $cacheFactory, baseEndPoint, $window) {

    return {
        getAll : function(query) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Product' + (query ? "?" + query : ""),
                cache : true
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getById : function(productId) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Product(' + productId + ')'
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        add : function(product) {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/odata/Product';
            $http({
                method: 'POST',
                url: url,
                data : product
            }).success(function(data, status, headers, config) {
                $cacheFactory.get("$http").removeAll();
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        
        update : function(product) {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/odata/Product(' + product.productId + ')'
            $http({
                method: 'PUT',
                url: url,
                data : product
            }).success(function(data, status, headers, config) {
                $cacheFactory.get("$http").removeAll();
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        delete : function(productId) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'DELETE',
                url: baseEndPoint + '/odata/Product(' + productId + ')'
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        
        deleteImage : function(file) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'DELETE',
                url: baseEndPoint + '/api/file?filename=' + file
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
}]);