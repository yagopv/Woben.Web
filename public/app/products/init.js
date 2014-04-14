var WobenProducts = angular.module('WobenProducts',['ui.router', 'ngDialog']);

WobenProducts.config(function($stateProvider) {
    $stateProvider
        .state('products', {
            url: "/products",
            templateUrl: "/app/templates/products/products.html",
            controller:    'PublicProductController',
            resolve: {
                User: function($state, $stateParams, $q, accountService) {
                    return accountService.isUserInRole(["User"]).then(
                        function(data) {
                            return data;
                        },
                        function(error) {
                            $state.go('login');
                        }
                    );
                }
            }
        });
    });
    
WobenProducts.config(function($stateProvider) {

        $stateProvider
            .state('productList', {
                url: "/dashboard/product/index",
                controller:  "IndexController",
                templateUrl: "/app/templates/products/productList.html",
                resolve: {
                    User: function($state, $stateParams, $q, accountService) {
                        return accountService.isUserInRole(["Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }
                }
            })
            .state('addProduct', {
                url: "/dashboard/product/new",
                controller:  "AddProductController",
                templateUrl: "/app/templates/products/addProduct.html",
                resolve: {
                    User: function($state, $stateParams, $q, accountService) {
                        return accountService.isUserInRole(["Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }
                }
            })
            .state('updateProduct', {
                url: "/dashboard/product/update/:productId",
                controller:  "UpdateProductController",
                templateUrl: "/app/templates/products/updateProduct.html",
                resolve: {
                    User: function($state, $stateParams, $q, accountService) {
                        return accountService.isUserInRole(["Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }
                }
            })
            .state('publicProducts', {
                url: "/products",
                controller:  "PublicProductController",
                templateUrl: "/app/templates/products/publicProducts.html",
                resolve: {
                    User: function($state, $stateParams, $q, accountService) {
                        return accountService.isUserInRole(["User", "Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('login');
                            }
                        );
                    }
                }
            });            
        });

WobenProducts.value("baseEndPoint", "https://woben.azurewebsites.net");