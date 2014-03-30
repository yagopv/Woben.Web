WobenDashboard.controller('AddProductController', function($scope, productService) {

    $scope.addProduct = function() {
        $scope.disabled = true;
        productService.add({ title : $scope.title, description : $scope.description }).then(
            function(data) {
                $scope.disabled = false;
            },
            function(error) {
                $scope.disabled = false;
            });
    }

    $scope.disabled = false;
});