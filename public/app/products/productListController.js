WobenProducts.controller("IndexController", ["$scope", "$filter", "productService", "errorService", "ngDialog",

    function($scope, $filter, productService, errorService, ngDialog) {

		$scope.skip = 0;
		$scope.top = 10;
        $scope.noMore = false;        
        $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top + "&$orderby=UpdatedDate desc";
        
        productService.getAll($scope.odataString).then(       
           function(data) {
               $scope.products = data;
               $scope.skip = $scope.top;               
            },
            function(error) {
                $scope.modelErrors = errorService.handleODataErrors(error);
            });

		$scope.search = function() {
			$scope.skip = 0;
			$scope.top = 10;
            if ($scope.query && $scope.query != "") {
                $scope.odataString = "$skip=" + $scope.skip +
                    "&$top=" + $scope.top  +
                    "&$filter=substringof('" + $scope.query + "', Name)" +
                    "or substringof('" + $scope.query + "', Description)" +
                    "or substringof('" + $scope.query + "', Markdown)" +
                    "&$orderby=UpdatedDate desc";

            } else {
                $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top + "&$orderby=UpdatedDate desc";
            }

			productService.getAll($scope.odataString).then(
				function(data) {
                    $scope.noMore = false;
					$scope.products = data;
					$scope.skip = $scope.top;			
				},
				function(error) {
					$scope.modelErrors = errorService.handleODataErrors(error);
				}
			);						
		};
		
		$scope.loadMore = function() {
            $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top + "&$orderby=UpdatedDate desc";
			productService.getAll($scope.odataString).then(
				function(data) {
                    if (data.length > 0) {
                        angular.forEach(data, function(product, index) {
                            $scope.products.push(product);
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


        $scope.sureToDelete = function(product) {
            $scope.selectedProduct = product;
            $scope.dialogMessage = "¿Seguro que quieres eliminar este producto?"
            ngDialog.open({
                template : "/app/templates/common/dialogConfirmation.html",
                scope : $scope
            });
        };

        $scope.confirmAction = function() {
            productService.delete($scope.selectedProduct.productId).then(
                function(data) {
                    var index = $scope.products.indexOf($scope.selectedProduct);
                    $scope.products.splice(index,1);
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                }
            )        
        }


        $scope.addProduct = function() {
            ngDialog.open({
                template: "/app/templates/products/addProduct.html",
                controller : "AddProductController",
                scope: $scope
            });
        }
}]);