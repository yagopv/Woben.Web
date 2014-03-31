WobenProducts.controller('AddProductController', function($scope, productService, errorService, categoryService) {

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
            //$scope.categories = data;
        },
        function(error) { 
          $scope.modelErrors = errorService.handleODataErrors(error);  
        });
    
    $scope.disabled = false;
    
    $scope.selectedCategory = null;
    
    $scope.categories = [{ id : 1, name : "Category1", description : "Category 1" }, { id : 2, name : "Category2", description : "Category 2" }];

});