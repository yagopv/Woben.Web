WobenProducts.controller('AddCategoryController', function($scope, categoryService, errorService) {

    $scope.addCategory = function() {
        $scope.disabled = true;
        categoryService.add({ name : $scope.name,
                              description : $scope.description
                           }).then(
            function(data) {
                $scope.disabled = false;
            },
            function(error) {
                $scope.modelErrors = errorService.handleODataErrors(error);
                $scope.disabled = false;
            });
    }

    $scope.disabled = false;
});