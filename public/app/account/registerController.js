WobenAccount.controller('RegisterController', ['$scope', 'accountService', 'errorService', 

function($scope, accountService, errorService) {
    
    $scope.register = function() {
        $scope.disabled = true;
        accountService.register({
            userName : $scope.userName,
            email    : $scope.email,
            password : $scope.password,
            confirmPassword : $scope.confirmPassword
        }).then(
            function(data) {
                accountService.login({
                    userName : $scope.userName,
                    password : $scope.password,
                    grant_type : "password"
                }).then(
                    function(data) {
                        $scope.User = accountService.User;
                        $scope.disabled = false;
                    },function(error) {
                        $scope.modelErrors = errorService.handleAuthenticationErrors(error);
                        $scope.disabled = false;
                    }
                );
                console.log(data);
            },function(errors) {
                $scope.modelErrors = errorService.handleValidationErrors(errors);
                $scope.disabled = false;
            }
        );
    }

    $scope.User = null;

    $scope.modelErrors = null;

    $scope.disabled = false;

}]);
