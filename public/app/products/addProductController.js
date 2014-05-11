WobenProducts.controller('AddProductController', ["$scope", "productService", "errorService", "ngDialog", "$state",
    
    function($scope, productService, errorService, ngDialog, $state) {

        $scope.addProduct = function() {
            $scope.disabled = true;
            productService.add({ name : $scope.name, isPublished : false}).then(
                function(data) {
                    $scope.disabled = false;
                    $scope.closeThisDialog();
                    $state.go("updateProduct", { productId :  data.productId });
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                    $scope.disabled = false;
                });
        }

        $scope.disabled = false;

}]);