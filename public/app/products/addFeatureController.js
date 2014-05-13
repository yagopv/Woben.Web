WobenProducts.controller('AddFeatureController', ["$scope", function($scope) {

    $scope.addFeature = function() {
        $scope.product.features.push({
            featureId : 0,
            productId : $scope.product.productId,
            name: $scope.feature.name,
            description: $scope.feature.description
        });
        $scope.closeThisDialog();
    }

}]);