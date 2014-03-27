WobenAccount.controller('LoginController', function($scope, $http, accountService, $state, errorService) {
        $scope.login = function() {
            $scope.disabled = true;
            accountService.login({
                userName : $scope.userName,
                password : $scope.password,
                grant_type : "password"
            }, $scope.rememberMe).then(
                function(data) {
                    $scope.User = accountService.User;
                    $scope.disabled = false;
                },function(error) {
                    $scope.modelErrors = errorService.handleAuthenticationErrors(error);
                    $scope.disabled = false;
                }
            );
        }

        $scope.rememberMe = false;

        $scope.User = null;

        $scope.modelErrors = null;

        $scope.disabled = false;
});