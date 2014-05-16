WobenContact.controller('ContactController', ["$scope", "messageService", "errorService",
    
    function($scope, messageService, errorService) {

        $scope.showConfirmationMessage = false;
        
        $scope.sendMessage = function() {
            messageService.add($scope.message).then(
                function(data) {
                    $scope.showConfirmationMessage = true;                    
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                }
            );
        }                
}]);