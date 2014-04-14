WobenAccount.controller('ResetPasswordController', function($scope, $http, accountService, $state, $stateParams, errorService) {
    $scope.disabled = true;
    $scope.email = $stateParams.email;
    $scope.code = $stateParams.code;
    
    $scope.resetPassword = function() {
        $scope.disabled = true;
        accountService.resetPassword($scope.email, $scope.password, $scope.confirmPassword, $scope.code).then(
            function(data) {
                $scope.disabled = false;
            },function(error) {
                $scope.modelErrors = errorService.handleAuthenticationErrors(error);
                $scope.disabled = false;
            }
        );
    }

    $scope.modelErrors = null;

    $scope.disabled = false;
});