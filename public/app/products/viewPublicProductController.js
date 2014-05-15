WobenProducts.controller("ViewPublicProductController", ["$scope", "$stateParams", "productService", "errorService", "$window", "$sce", "accountService",
	function($scope, $stateParams, productService, errorService, $window, $sce, accountService) {

        $scope.User = accountService.User;

		$scope.optionSelected = "I";

		if ($stateParams.urlCode != "preview") {
			productService.getAll("$expand=Category,Tags,Features&$filter=UrlCodeReference eq '" + $stateParams.urlCode + "'").then(
				function(data) {
					$scope.product = data[0];
					if ($scope.product.html) {
						$scope.trustedHtml = $sce.trustAsHtml($scope.product.html);						
					}
                    startupKit.uiKitBlog.blog1();
				},
				function(error) {
					$scope.modelErrors = errorService.handleoDataErrors(error);
				}			
			)										
		}

		$scope.sendNotification = function() {
			console.log($scope);
		}
		
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