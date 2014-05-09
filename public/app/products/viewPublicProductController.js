WobenProducts.controller("ViewPublicProductController", ["$scope", "$stateParams", "productService", "errorService", "$window", "$sce",
	function($scope, $stateParams, productService, errorService, $window, $sce) {
		if ($stateParams.urlCode != "preview") {
			productService.getAll("$expand=Category&$filter=UrlCodeReference eq '" + $stateParams.urlCode + "'").then(
				function(data) {
					$scope.product = data[0];
					if ($scope.product.html) {
						$scope.trustedHtml = $sce.trustAsHtml($scope.product.html);						
					}					
				},
				function(error) {
					$scope.modelErrors = errorService.handleoDataErrors(error);
				}			
			)										
		}

        startupKit.uiKitBlog.blog1();

		$scope.updatePreviewData = function(product) {
			if (product.html) {					
				$scope.trustedHtml = $sce.trustAsHtml(product.html);
			}				
			$scope.$apply(function(){
            	$scope.product = product;
          	});
		}
	}
]);