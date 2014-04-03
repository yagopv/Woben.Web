WobenProducts.controller('UpdateProductController', function($scope, productService, errorService, categoryService, ngDialog, $sce, $stateParams) {

    $scope.updateProduct = function() {
        $scope.disabled = true;
        $scope.product.html = marked($scope.product.markdown);
        productService.update($scope.product).then(
            function(data) {
                $scope.disabled = false;
            },
            function(error) {
                $scope.modelErrors = errorService.handleODataErrors(error);
                $scope.disabled = false;
            });
    }

    categoryService.getAll().then(
        function(data) {
            $scope.categories = data;
        },
        function(error) { 
          $scope.modelErrors = errorService.handleODataErrors(error);  
        });
    
    productService.getById($stateParams.productId).then(
        function(data) {
            $scope.product = data;
        },
        function(error) {
          $scope.modelErrors = errorService.handleODataErrors(error);  
        });        

    $scope.addCategoryDialog = function() {
       ngDialog.open({ 
            template: "/app/templates/products/addCategory.html",
            controller : "AddCategoryController",
            scope: $scope
       });
    }

    $scope.disabled = false;

    $scope.previewHtml = false;

    $scope.togglePreview = function() {
        $scope.trustedHtml = $sce.trustAsHtml(marked($scope.product.markdown ? $scope.product.markdown : ""));
        $scope.previewHtml = !$scope.previewHtml;
    }
});