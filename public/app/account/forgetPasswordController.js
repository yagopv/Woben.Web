WobenAccount.controller('ForgetPasswordController', function($scope, $http, accountService, $state, errorService) {
    $scope.disabled = true;
    
    $scope.sendConfirmationMail = function() {
        $scope.disabled = true;
        accountService.forgotPassword($scope.email).then(
            function(data) {
                $scope.disabled = false;
            },function(error) {
                $scope.modelErrors = errorService.handleValidationErrors(error);
                $scope.disabled = false;
            }
        );
    }

    $scope.modelErrors = null;

    $scope.disabled = false;
});