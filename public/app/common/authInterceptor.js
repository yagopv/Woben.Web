WobenCommon.factory('authInterceptor', ["$rootScope", "$q", "$window", 

function ($rootScope, $q, $window) {
        
        return {
            request: function (config) {
                config.headers = config.headers || {};
                var token = $window.sessionStorage.token;
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    console.log(response);
                }
                return response || $q.when(response);
            }
        };
}]);