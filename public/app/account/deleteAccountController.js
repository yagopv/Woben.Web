WobenAccount.controller('DeleteAccountController', function($scope, accountService, $state, errorService, ngDialog) {
    $scope.sureToDelete = function() {
        $scope.dialogMessage = "¿Seguro que quieres cancelar tu cuenta?"
        ngDialog.open({
            template : "/app/templates/common/dialogConfirmation.html",
            scope : $scope
        });
    }

    $scope.confirmAction = function() {
        accountService.deleteAccount().then(
            function(data) {
                accountService.logout();
            },
            function(error) {
                $scope.modelErrors = errorService.handleAuthenticationErrors(error);
            }
        )
    }
});