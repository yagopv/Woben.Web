WobenAccount.controller('ChangePasswordController', function($scope, accountService, $state, errorService) {

    $scope.disabled = false;
    
    $scope.changePassword = function() {
        $scope.disabled = true;
        accountService.changePassword($scope.oldPassword, $scope.newPassword, $scope.confirmPassword)
            .then(function(data) {
                $scope.disabled = false;
            }, function(error) {
                $scope.modelErrors = errorService.handleAuthenticationErrors(error);
                $scope.disabled = false;
            })
    }

});