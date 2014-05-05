WobenAccount.controller('ResetPasswordController', ['$scope', 'accountService', '$state', '$stateParams', 'errorService', 

function($scope, accountService, $state, $stateParams, errorService) {
    
    $scope.disabled = true;
    $scope.email = $stateParams.email;
    $scope.code = $stateParams.code;
    $scope.resetPasswordSuccess = false;

    $scope.resetPassword = function() {
        $scope.disabled = true;
        accountService.resetPassword($scope.email, $scope.password, $scope.confirmPassword, $scope.code).then(
            function(data) {
                $scope.disabled = false;
                $scope.resetPasswordSuccess = true;
                $scope.resetPasswordForm.$setPristine();
            },function(error) {
                $scope.modelErrors = errorService.handleAuthenticationErrors(error);
                $scope.disabled = false;
            }
        );
    }

    $scope.closeInfo = function() {
        $scope.mailSentSuccess = false
    }

    $scope.modelErrors = null;

    $scope.disabled = false;
}]);