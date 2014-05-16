WobenProducts.controller("NotificationListController", ["$scope", "notificationService", "errorService",

	function($scope, notificationService, errorService) {
		
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
                    "' or PhoneNumber eq '"      + $scope.query +
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
}]);