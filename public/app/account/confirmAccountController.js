WobenAccount.controller('ConfirmAccountController', ['$scope', 'accountService', '$state', 'errorService', 'ngDialog', 

    function($scope, accountService, $state, errorService, ngDialog) {

    $scope.disabled = false;
    $scope.showEmailSent = false;

    $scope.sendConfirmationMail = function() {
        $scope.disabled = true;
        $scope.showEmailSent = false;
        accountService.sendConfirmationMail().then(
            function(data) {
                $scope.showEmailSent = true;
                $scope.disabled = false;
            },
            function(error) {
                $scope.modelErrors = errorService.handleAuthenticationErrors(error);
                $scope.disabled = false;
            }
        );
    }
}]);