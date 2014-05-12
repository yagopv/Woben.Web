WobenProducts.controller('UpdateProductController', function($scope, productService, errorService, categoryService, ngDialog, $sce, $stateParams,$q, baseEndPoint, $timeout) {

    $scope.tags = "";
    $scope.tagMaxIndex = "";
    
    $scope.updateProduct = function() {
        $scope.disabled = true;
        $scope.product.html = marked($scope.product.markdown ? $scope.product.markdown : "");
        productService.update($scope.product).then(
            function(data) {
                $scope.disabled = false;
                $scope.product = data;
                var tags = [];
                if (angular.isObject($scope.product.tags)) {
                    angular.forEach($scope.product.tags, function(value, key) {
                        tags.push($scope.product.tags[key].name);
                    });
                    $scope.tagMaxIndex = Object.keys($scope.product.tags)[Object.keys($scope.product.tags).length - 1];
                    $scope.tags = tags.toString();
                    $(".tagsinput").importTags($scope.tags);
                } else {
                    $scope.tagMaxIndex = "0";
                    $scope.product.tags = {};
                }                                
            },
            function(error) {
                $scope.modelErrors = errorService.handleODataErrors(error);
                $scope.disabled = false;
            });
    };

    $q.all([ productService.getAll("$filter=ProductId eq " + $stateParams.productId + "&$expand=Tags"), categoryService.getAll()])
        .then( 
            function(data) {
                $scope.product = data[0][0];
                $scope.categories = data[1];
                var tags = [];
                if (angular.isObject($scope.product.tags)) {
                    angular.forEach($scope.product.tags, function(value, key) {
                        tags.push($scope.product.tags[key].name);
                    });
                    $scope.tagMaxIndex = Object.keys($scope.product.tags)[Object.keys($scope.product.tags).length - 1];
                    $scope.tags = tags.toString();
                    _bindTagsInput();
                } else {
                    $scope.tagMaxIndex = "0";
                    $scope.product.tags = {};
                }
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

    function _bindTagsInput() {
        $(".tagsinput").tagsInput({
            'onChange' : function(theTag) {
                $("input[name=tagsinput]").trigger("input");
            },
            'onAddTag' : function(tag) {
                var index = (parseInt($scope.tagMaxIndex) + 1).toString();
                $scope.product.tags[index] = {                     
                    tagId : 0,
                    name : tag,
                    productId : $scope.product.productId
                };
                $scope.tagMaxIndex = index;
            },
            'onRemoveTag' : function(tag) {
                if (angular.isObject($scope.product.tags)) {                     
                    angular.forEach($scope.product.tags, function (value, index) {
                        if(value.name == tag) {
                            if (value.tagId > 0) {
                                value.tagId = -1;                            
                            } else {
                                delete $scope.product.tags[index];                                
                            }
                        }
                    });
                }
            }
        });
        $(".tagsinput").importTags($scope.tags);        
    }
});