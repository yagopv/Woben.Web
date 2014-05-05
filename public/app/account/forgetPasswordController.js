WobenAccount.controller('ForgetPasswordController', ['$scope', 'accountService', '$state', 'errorService',

function($scope, accountService, $state, errorService) {
    
    $scope.disabled = true;
    $scope.mailSentSuccess = false;

    $scope.sendConfirmationMail = function() {
        $scope.disabled = true;
        accountService.forgotPassword($scope.email).then(
            function(data) {
                $scope.disabled = false;
                $scope.email = "";
                $scope.mailSentSuccess = true;
                $scope.forgetPasswordForm.$setPristine();
            },function(error) {
                $scope.modelErrors = errorService.handleValidationErrors(error);
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