var WobenDashboard = angular.module('WobenDashboard',['ui.router']);

WobenDashboard.config(function($stateProvider){
        $stateProvider
            .state('dashboard', {
                url: "/dashboard",
                controller:  "DashboardController",
                templateUrl: "/app/templates/dashboard/index.html",
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
            .state('signin', {
                url: "/dashboard/signin",
                controller:  "LoginController",
                templateUrl: "/app/templates/dashboard/signin.html"
            })
            .state('productList', {
                url: "/dashboard/product/list",
                controller:  "ProductListController",
                templateUrl: "/app/templates/dashboard/productList.html",
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
                templateUrl: "/app/templates/dashboard/product/addProduct.html",
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
            });
        });

WobenDashboard.value("productEndPoint", "http://localhost:22657/odata")