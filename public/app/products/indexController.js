WobenProducts.controller("IndexController", function($scope, productService, errorService, ngDialog) {
   productService.getAll().then(
       function(data) {
           $scope.products = data;
       },
       function(error) {
           $scope.modelErrors = errorService.handleODataErrors(error);
       });

    $scope.deleteProduct = function(product) {
        productService.delete(product.productId).then(
            function(data) {
                var index = $scope.products.indexOf(product);
                $scope.products.splice(index,1);
                $scope.selectedProduct = null;
            },
            function(error) {
                $scope.modelErrors = errorService.handleODataErrors(error);
                $scope.selectedProduct = null;
            }
        )
    }

    $scope.sureToDelete = function(product) {
        $scope.selectedProduct = product;

        ngDialog.open({
            template : "/app/templates/common/dialogConfirmation.html",
            scope : $scope
        });
    }

    $scope.confirmAction = function() {
        $scope.deleteProduct($scope.selectedProduct);
    }
});