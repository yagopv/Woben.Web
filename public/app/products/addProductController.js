WobenProducts.controller('AddProductController', function($scope, productService, errorService, categoryService, ngDialog, $sce) {

    $scope.addProduct = function() {
        $scope.disabled = true;
        productService.add({ name : $scope.name, 
                             description : $scope.description,
                             isPublished : $scope.isPublished,
                             imageUrl : $scope.imageUrl,
                             markdown : $scope.markdown,
                             html : marked($scope.markdown ? $scope.markdown : ""),
                             categoryId : $scope.selectedCategory
                           }).then(
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
    
    $scope.addCategoryDialog = function() {
       ngDialog.open({ 
            template: "/app/templates/products/addCategory.html",
            controller : "AddCategoryController",
            scope: $scope
       });
    }

    $scope.disabled = false;
    
    $scope.selectedCategory = null;

    $scope.html = "";

    $scope.previewHtml = false;

    $scope.togglePreview = function() {
        $scope.trustedHtml = $sce.trustAsHtml(marked($scope.markdown ? $scope.markdown : ""));
        $scope.previewHtml = !$scope.previewHtml;
    }
});