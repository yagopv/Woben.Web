WobenProducts.controller('UpdateProductController', ["$scope", "productService", "errorService", "categoryService", "ngDialog", "$sce", "$stateParams","$q", "baseEndPoint", "$timeout",

function($scope, productService, errorService, categoryService, ngDialog, $sce, $stateParams,$q, baseEndPoint, $timeout) {

    $scope.tags = "";    
    $scope.updateProduct = function() {
        $scope.disabled = true;
        $scope.product.html = marked($scope.product.markdown ? $scope.product.markdown : "");
        $scope.product.category = null;
        productService.update($scope.product).then(
            function(data) {
                productService.getAll("$filter=ProductId eq " + $stateParams.productId + "&$expand=Tags,Features,Category,Images").then(
                    function(data) {
                        $scope.disabled = false;
                        $scope.product = data[0];
                        var tags = [];
                        if (angular.isArray($scope.product.tags)) {
                            angular.forEach($scope.product.tags, function(value, key) {                                
                                tags.push($scope.product.tags[key.toString()].name);
                            });
                            $scope.tags = tags.toString();
                            $(".tagsinput").importTags($scope.tags);
                        } else {
                            $scope.product.tags = {};
                        }
                        if (!$scope.tagMaxIndex) {
                            $scope.tagMaxIndex = "0";
                        }                        
                    },
                    function(error) {
                        $scope.modelErrors = errorService.handleODataErrors(error);
                        $scope.disabled = false;
                    });
            },
            function(error) {
                $scope.modelErrors = errorService.handleODataErrors(error);
                $scope.disabled = false;
            });
    };

    $q.all([ productService.getAll("$filter=ProductId eq " + $stateParams.productId + "&$expand=Tags,Features,Category,Images"), categoryService.getAll()])
        .then(
            function(data) {
                $scope.product = data[0][0];
                $scope.categories = data[1];
                var tags = [];
                if (angular.isArray($scope.product.tags)) {
                    angular.forEach($scope.product.tags, function(value, key) {
                        tags.push($scope.product.tags[key].name);
                    });
                    $scope.tags = tags.toString();
                    _bindTagsInput();
                } else {
                    $scope.product.tags = {};
                }
                if (!$scope.tagMaxIndex) {
                    $scope.tagMaxIndex = "0";
                }                
                $timeout(function() {
                    _updateIframe($scope.product);
                },5000);
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

    $scope.baseEndPoint = baseEndPoint;
    
    $scope.uploadedFiles = [];

    $scope.togglePreview = function() {
        $scope.trustedHtml = $sce.trustAsHtml(marked($scope.product.markdown ? $scope.product.markdown : ""));
        $scope.previewHtml = !$scope.previewHtml;
    }

    $scope.setFeaturedImage = function(image) {
        if (image.url == $scope.product.imageUrl) {
            $scope.product.imageUrl = null;
        }  else {
            $scope.product.imageUrl = image.url;    
        }            
    }

    $scope.removeImage = function(image, index) {
        if (image.imageId > 0) {
            image.imageId = -1;    
        }   
        
        if (image.imageId == 0) {
            $scope.product.images.splice(index, 1);    
        } 
                
        if (image.url == $scope.product.imageUrl) {
            $scope.product.imageUrl = null;
        }    
    }

    $scope.$watch("product", function(prod) {
       _updateIframe(prod);
    }, true);

    function _updateIframe(prod) {
        var iframe = document.getElementById("preview-frame").contentWindow;
        if (prod && iframe.angular) {
            prod.html = marked(prod.markdown ? prod.markdown : "");
            iframe.angular.element("#product-view").scope().updatePreviewData(prod);
        }
    }

    function _bindTagsInput() {
        $(".tagsinput").tagsInput({
            'onChange' : function(theTag) {
                $("input[name=tagsinput]").trigger("input");
            },
            'onAddTag' : function(tag) {
                $scope.product.tags.push({
                    tagId : 0,
                    name : tag,
                    productId : $scope.product.productId
                });
            },
            'onRemoveTag' : function(tag) {
                if (angular.isArray($scope.product.tags)) {
                    angular.forEach($scope.product.tags, function (value, index) {
                        if(value.name == tag) {
                            if (value.tagId > 0) {
                                value.tagId = -1;
                            } else {
                                $scope.product.tags.splice(index,1);
                            }
                        }
                    });
                }
            }
        });
        $(".tagsinput").importTags($scope.tags);        
    }

    /* Features */

    $scope.addFeature = function() {
        ngDialog.open({
            template: "/app/templates/products/addFeature.html",
            controller : "AddFeatureController",
            scope: $scope
        });
    }

    $scope.deleteFeature = function(feature) {
        var features = angular.copy($scope.product.features);
        if (angular.isArray(features)) {
            angular.forEach(features, function (value, index) {
                if(value.name == feature.name) {
                    if (value.featureId > 0) {
                        $scope.product.features[index].featureId = -1;
                    } else {
                        if (value.featureId == 0) {
                            $scope.product.features.splice(index, 1);
                        }
                    }
                }
            });
        }
    }

}]);