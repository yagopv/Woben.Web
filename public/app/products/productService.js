WobenProducts.factory('productService', function($http, $q, $cacheFactory, productEndPoint) {

    return {
        getAll : function() {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: productEndPoint + '/Product',
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
                self = this,
                url = productEndPoint + '/Product';
            $http({
                method: 'POST',
                url: url,
                data : product
            }).success(function(data, status, headers, config) {
                $cacheFactory.get("$http").remove(url);
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        
        update : function(product) {
            var deferred = $q.defer(),
                self = this,
                url = productEndPoint + '/Product(' + product.productId + ')'
            $http({
                method: 'PUT',
                url: url,
                data : product
            }).success(function(data, status, headers, config) {
                $cacheFactory.get("$http").remove(url);
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
                url: productEndPoint + '/Product(' + productId + ')'
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
});