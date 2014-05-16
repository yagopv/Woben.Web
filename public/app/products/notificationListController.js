WobenProducts.controller("NotificationListController", ["$scope", "notificationService", "errorService",

	function($scope, notificationService, errorService) {
		
		$scope.skip = 0;
		$scope.top = 10;
		$scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top;

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
			$scope.odataString = "$skip=" + $scope.skip + 
								 "&$top=" + $scope.top  + 
								 "&$filter=CreatedBy eq " + $scope.query + 
								 "or PhoneNumber eq"      + $scope.query +
								 "&$orderby CreatedDate desc";

			notificationService.getAll($scope.odataString).then(
				function(data) {
					$scope.notifications = data;
					$scope.skip = $scope.top;			
				},
				function(error) {
					$scope.modelErrors = errorService.handleODataErrors(error);
				}
			);						
		};
		
		$scope.loadMore = function() {								 			
			notificationService.getAll($scope.odataString).then(
				function(data) {
					$scope.notifications = data;
					$scope.skip = $scope.top * 2;			
				},
				function(error) {
					$scope.modelErrors = errorService.handleODataErrors(error);
				}
			);
		};
}]);