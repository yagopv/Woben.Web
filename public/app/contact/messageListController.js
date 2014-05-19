WobenContact.controller('MessageListController', ["$scope", "messageService", "errorService", "ngDialog",
    
    function($scope, messageService, errorService, ngDialog) {
		
		$scope.skip = 0;
		$scope.top = 10;
        $scope.noMore = false;
        $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top;

		messageService.getAll($scope.odataString).then(
			function(data) {
				$scope.messages = data;
				$scope.skip = $scope.top;			
			},
			function(error) {
				$scope.modelErrors = errorService.handleODataErrors(error);
			}
		);
		
		$scope.search = function() {
			$scope.skip = 0;
			$scope.top = 10;
            if ($scope.query && $scope.query != "") {
                $scope.odataString = "$skip=" + $scope.skip +
                    "&$top=" + $scope.top  +
                    "&$filter=CreatedBy eq '" + $scope.query +
                    "' or PhoneNumber eq '"   + $scope.query +                    
                    "' or Name eq '"          + $scope.query +
                    "' or Email eq '"         + $scope.query +
                    "' or Text eq '"          + $scope.query +
                    "&$orderby=CreatedDate desc";

            } else {
                $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top;
            }

			messageService.getAll($scope.odataString).then(
				function(data) {
                    $scope.noMore = false;
					$scope.messages = data;
					$scope.skip = $scope.top;			
				},
				function(error) {
					$scope.modelErrors = errorService.handleODataErrors(error);
				}
			);						
		};
		
		$scope.loadMore = function() {
            $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top;
			messageService.getAll($scope.odataString).then(
				function(data) {
                    if (data.length > 0) {
                        angular.forEach(data, function(message, index) {
                            $scope.messages.push(message);
                        });
                    }
                    if (data.length < $scope.top) {
                        $scope.noMore = true;
                    }
                    $scope.skip = $scope.skip + $scope.top;
				},
				function(error) {
					$scope.modelErrors = errorService.handleODataErrors(error);
				}
			);
		};

        /**
         * Delete message confirmation dialog
         * @param message
         */
        $scope.sureToDelete = function(message) {
            $scope.messageToDelete = message;
            $scope.dialogMessage = "¿Seguro que quieres eliminar esta notificación?"
            ngDialog.open({
                template : "/app/templates/common/dialogConfirmation.html",
                scope : $scope
            });
        };

        /**
         * Confirm deletion when the user click ok in the dialog box
         */
        $scope.confirmAction = function() {
            messageService.delete($scope.messageToDelete.messageId).then(
                function(data) {
                    var index = $scope.messages.indexOf($scope.messageToDelete);
                    $scope.messages.splice(index,1);
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                }
            )
        };
        
        /**
         * Check the message details
         */
        $scope.checkMessage = function(message) {
            $scope.messageDetail = message;
            ngDialog.open({
                template : "/app/templates/contact/messageDetail.html",
                scope : $scope
            });            
        };
}]);