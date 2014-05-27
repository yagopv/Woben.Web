WobenContact.controller('ContactController', ["$scope", "messageService", "errorService",
    
    function($scope, messageService, errorService) {

        $scope.disabled = false;
        $scope.showConfirmationMessage = false;
        $scope.showNotificationMessage = false;
                
        $scope.sendMessage = function() {
            $scope.disabled = true;
            messageService.add($scope.message).then(
                function(data) {
                    $scope.disabled = false;
                    $scope.showConfirmationMessage = true; 
                    $scope.showNotificationMessage = true;                   
                },
                function(error) {
                    $scope.disabled = false;
                    $scope.modelErrors = errorService.handleODataErrors(error);
                }
            );
        };
        
        $scope.sendAnotherMessage = function() {
            $scope.showNotificationMessage = false;
        };             
}]);