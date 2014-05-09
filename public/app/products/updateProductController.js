WobenProducts.controller('UpdateProductController', function($scope, productService, errorService, categoryService, ngDialog, $sce, $stateParams,$q, baseEndPoint, $timeout) {

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

    $q.all([ productService.getById($stateParams.productId), categoryService.getAll()])
        .then(
            function(data) {
                $scope.product = data[0];
                $scope.categories = data[1];
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

    $scope.$watch("product", function(prod) {
        var iframe = document.getElementById("preview-frame").contentWindow;
        if (prod && iframe.angular) {
            prod.html = marked(prod.markdown ? prod.markdown : "");
            iframe.angular.element("#product-view").scope().updatePreviewData(prod);
        }
    }, true);

    $timeout(function() {
        $scope.product.init = true;
    }, 2500);
});