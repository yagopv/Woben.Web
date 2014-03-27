var Woben = angular.module('Woben',['WobenAccount', 'WobenCommon', 'ui.router']);

Woben
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');

        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function(data)
        {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function(obj)
            {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;

                for(name in obj)
                {
                    value = obj[name];

                    if(value instanceof Array)
                    {
                        for(i=0; i<value.length; ++i)
                        {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if(value instanceof Object)
                    {
                        for(subName in value)
                        {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if(value !== undefined && value !== null)
                    {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };

            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    })
    .config(function($stateProvider, $urlRouterProvider, $locationProvider){
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "app/home/home.html",
                controller : "HomeController"
            })
            .state('products', {
                url: "/products",
                templateUrl: "app/products/products.html",
                controller:    'ProductsController',
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
            })
            .state('login', {
                url: "/login",
                templateUrl: "app/account/login.html",
                controller:    'LoginController'
            })
            .state('register', {
                url: "/register",
                templateUrl: "app/account/register.html",
                controller:    'RegisterController'
            })
            .state('manage', {
                url: "/manage",
                templateUrl: "app/account/manage.html",
                controller:    'ManageController',
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
            })
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "app/admin/dashboard.html",
                controller:    'DashboardController',
                resolve: {
                    User: function($state, $stateParams, $q, accountService) {
                        return accountService.isUserInRole(["Administrator"]).then(
                            function(data) {
                               return data;
                            },
                            function(error) {
                                $state.go('login');
                            }
                        );
                    }
                }
            })
            .state('notfound', {
                url: "/404",
                templateUrl: "app/common/404.html"
            });

        $urlRouterProvider.otherwise("/404");

        $locationProvider.html5Mode(true);
    }).run(function(accountService) {
        accountService.initializeAuth();
    });


