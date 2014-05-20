WobenProducts.controller("NotificationListController", ["$scope", "notificationService", "errorService", "ngDialog",

	function($scope, notificationService, errorService, ngDialog) {
		
		$scope.skip = 0;
		$scope.top = 10;
                $scope.noMore = false;
                $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top + "&$expand=Product";

		notificationService.getAll($scope.odataString).then(
			function(data) {
				$scope.notifications = data;
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
                    "' or Text eq '"          + $scope.query +
                    "'&$expand=Product" +
                    "&$orderby=CreatedDate desc";

            } else {
                $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top + "&$expand=Product";
            }

			notificationService.getAll($scope.odataString).then(
				function(data) {
                    $scope.noMore = false;
					$scope.notifications = data;
					$scope.skip = $scope.top;			
				},
				function(error) {
					$scope.modelErrors = errorService.handleODataErrors(error);
				}
			);						
		};
		
		$scope.loadMore = function() {
            $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top + "&$expand=Product";
			notificationService.getAll($scope.odataString).then(
				function(data) {
                    if (data.length > 0) {
                        angular.forEach(data, function(notification, index) {
                            $scope.notifications.push(notification);
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
         * Delete notification confirmation dialog
         * @param notification
         */
        $scope.sureToDelete = function(notification) {
            $scope.notificationToDelete = notification;
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
            notificationService.delete($scope.notificationToDelete.notificationId).then(
                function(data) {
                    var index = $scope.notifications.indexOf($scope.notificationToDelete);
                    $scope.notifications.splice(index,1);
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                }
            )
        };
        
        /**
         * Check the notification details
         */
        $scope.checkNotification = function(notification) { 
            $scope.notificationDetail = notification;
            ngDialog.open({
                template : "/app/templates/products/notificationDetail.html",
                scope : $scope
            });
        };
}]);