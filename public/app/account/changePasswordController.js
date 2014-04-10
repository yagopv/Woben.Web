WobenAccount.controller('ChangePasswordController', function($scope, accountService, $state, errorService) {

    $scope.disabled = false;
    
    $scope.changePassword = function() {
        $scope.disabled = true;
        accountService.changePassword($scope.oldPassword, $scope.newPassword, $scope.confirmPassword)
            .then(function(data) {
                $scope.disabled = false;
                $scope.modelErrors = null;
                $scope.oldPassword = null;
                $scope.newPassword = null;
                $scope.confirmPassword = null;
                $scope.changePasswordForm.$setPristine();
            }, function(error) {
                $scope.modelErrors = errorService.handleValidationErrors(error);
                $scope.disabled = false;
            })
    }

});