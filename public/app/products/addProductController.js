WobenProducts.controller('AddProductController', function($scope, productService, errorService, categoryService, ngDialog, $sce, baseEndPoint, $state) {

    $scope.addProduct = function() {
        $scope.disabled = true;
        $scope.product.html = marked($scope.product.markdown ? $scope.product.markdown : "");
        productService.add($scope.product).then(
            function(data) {
                $scope.disabled = false;
                $state.go("updateProduct", { productId :  data.productId });
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
    
    $scope.addCategoryDialog = function() {
       ngDialog.open({ 
            template: "/app/templates/products/addCategory.html",
            controller : "AddCategoryController",
            scope: $scope
       });
    }

    $scope.disabled = false;
    
    $scope.categoryId = null;

    $scope.previewHtml = false;

    $scope.uploadedFiles = [];
    
    $scope.$watch("uploadedFiles", function(newValue, oldValue) {
        if (newValue && newValue[0]) {
            $scope.product.imageUrl = baseEndPoint + newValue[0].url;

        }
    });

    $scope.togglePreview = function() {
        $scope.trustedHtml = $sce.trustAsHtml(marked($scope.product.markdown ? $scope.product.markdown : ""));
        $scope.previewHtml = !$scope.previewHtml;
    }
});