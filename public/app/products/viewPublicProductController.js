WobenProducts.controller("ViewPublicProductController", ["$scope", "$stateParams", "productService", "errorService", 

	function($scope, $stateParams, productService, errorService) {
		productService.getAll("$filter=UrlCodeReference eq '" + $stateParams.urlCode + "'").then(
			function(data) {
				$scope.product = data[0];
			},
			function(error) {
				$scope.modelErrors = errorService.handleoDataErrors(error);
			}			
		)							
	}
]);