var WobenProducts = angular.module('WobenProducts',['ui.router', 'ngDialog']);

WobenProducts.config(["$stateProvider", function($stateProvider) {
        $stateProvider
            .state('productList', {
                url: "/dashboard/product/index",
                controller:  "IndexController",
                templateUrl: "/app/templates/products/productList.html",
                resolve: {
                    User: ["$state", "accountService", function($state, accountService) {
                        return accountService.isUserInRole(["Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }]
                }
            })
            .state('updateProduct', {
                url: "/dashboard/product/update/:productId",
                controller:  "UpdateProductController",
                templateUrl: "/app/templates/products/updateProduct.html",
                resolve: {
                    User: ["$state", "accountService", function($state, accountService) {
                        return accountService.isUserInRole(["Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }]
                }
            })
            .state('publicProducts', {
                url: "/products",
                controller:  "PublicProductController",
                templateUrl: "/app/templates/products/publicProducts.html",
                resolve: {
                    User: ["$state", "accountService", function($state, accountService) {
                        return accountService.isUserInRole(["User", "Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('login');
                            }
                        );                        
                    }],
                    TypeaheadData: ["$state", "productService", function($state, productService) {
                        return productService.getAll("$select=Name,Description").then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('login');
                            }
                        );
                    }]          
                }
            })
            .state('viewPublicProduct', {
                url: "/products/:urlCode",
                controller:  "ViewPublicProductController",
                templateUrl: "/app/templates/products/viewPublicProduct.html",
                resolve: {
                    User: ["$state", "accountService", function($state, accountService) {
                        return accountService.isUserInRole(["User", "Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('login');
                            }
                        );
                    }]
                }
            })
            .state('notificationList', {
                url: "/dashboard/notification/index",
                controller:  "NotificationListController",
                templateUrl: "/app/templates/products/notificationList.html",
                resolve: {
                    User: ["$state", "accountService", function($state, accountService) {
                        return accountService.isUserInRole(["Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }]
                }
            });                     
        }]);

WobenProducts.value("baseEndPoint", "https://woben.azurewebsites.net");