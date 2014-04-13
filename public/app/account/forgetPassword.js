WobenAccount.controller('ForgetPasswordController', function($scope, $http, accountService, $state, errorService) {
    $scope.startProcess = function() {
        /*
        $scope.disabled = true;
        accountService.forgotPassword({
            email : $scope.email
        }, $scope.rememberMe).then(
            function(data) {
                $scope.disabled = false;
            },function(error) {
                $scope.modelErrors = errorService.handleAuthenticationErrors(error);
                $scope.disabled = false;
            }
        );*/
    }

    $scope.modelErrors = null;

    $scope.disabled = false;
});