WobenProducts.controller('AddProductController', function($scope, productService, errorService, categoryService, ngDialog) {

    $scope.addProduct = function() {
        $scope.disabled = true;
        productService.add({ title : $scope.title, 
                             description : $scope.description,
                             isPublished : $scope.isPublished,
                             imageUrl : $scope.imageUrl
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
       ngDialog.open({ template: '/app/templates/common/404.html' });
    }

    $scope.disabled = false;
    
    $scope.selectedCategory = null;
    
    $scope.$watch("$scope.markdown", function(new, old) {
       $scope.html = marked($scope.markdown);
    });

});