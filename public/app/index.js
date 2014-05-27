var Woben = angular.module('Woben',['WobenAccount', 'WobenCommon', 'WobenProducts', 'WobenContact', 'WobenAbout', 'ui.router', 'ngAnimate']);

Woben
.config(["$httpProvider",
    
    function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.interceptors.push('oDataInterceptor');
        $httpProvider.interceptors.push('loaderInterceptor');

        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

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
    }])
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", 
        function($stateProvider, $urlRouterProvider, $locationProvider){
            $stateProvider
                .state('home', {
                    url: "/",
                    templateUrl: "/app/templates/home/home.html",
                    controller : "HomeController"
                })
                .state('notfound', {
                    url: "/404",
                    templateUrl: "/app/templates/common/404.html"
                });
    
            $urlRouterProvider.otherwise("/404");
    
            $locationProvider.html5Mode(true);
    }])
    .run(['accountService', '$rootScope', 
        function(accountService, $rootScope) {
            accountService.initializeAuth();
    
            $rootScope.$on('$stateChangeSuccess',function(){
                $("html, body").animate({ scrollTop: 0 }, 200);
            });
    }]);


