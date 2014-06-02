var WobenProducts = angular.module('WobenProducts',['ui.router', 'ngDialog']);

WobenProducts.config(["$stateProvider", function($stateProvider) {
        $stateProvider
            .state('productList', {
                url: "/dashboard/product/index",
                controller:  "IndexController",
                templateUrl: "/app/templates/products/productList.html",
                resolve: {
                    User: ["$state", "accountService", function($state, accountService) {
                        return accountService.isUserInRole(["Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }]
                }
            })
            .state('updateProduct', {
                url: "/dashboard/product/update/:productId",
                controller:  "UpdateProductController",
                templateUrl: "/app/templates/products/updateProduct.html",
                resolve: {
                    User: ["$state", "accountService", function($state, accountService) {
                        return accountService.isUserInRole(["Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }]
                }
            })
            .state('publicProducts', {
                url: "/products",
                controller:  "PublicProductController",
                templateUrl: "/app/templates/products/publicProducts.html",
                resolve: {
                    User: ["$state", "accountService", function($state, accountService) {
                        return accountService.isUserInRole(["User", "Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('login');
                            }
                        );                        
                    }],
                    TypeaheadData: ["$state", "productService", function($state, productService) {
                        return productService.getAll("$select=Name,Description").then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('login');
                            }
                        );
                    }]          
                }
            })
            .state('viewPublicProduct', {
                url: "/products/:urlCode",
                controller:  "ViewPublicProductController",
                templateUrl: "/app/templates/products/viewPublicProduct.html",
                resolve: {
                    User: ["$state", "accountService", function($state, accountService) {
                        return accountService.isUserInRole(["User", "Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('login');
                            }
                        );
                    }]
                }
            })
            .state('notificationList', {
                url: "/dashboard/notification/index",
                controller:  "NotificationListController",
                templateUrl: "/app/templates/products/notificationList.html",
                resolve: {
                    User: ["$state", "accountService", function($state, accountService) {
                        return accountService.isUserInRole(["Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }]
                }
            });                     
        }]);

WobenProducts.value("baseEndPoint", "https://woben.azurewebsites.net");
WobenProducts.factory('productService', ["$http", "$q", "$cacheFactory", "baseEndPoint", "$window", 

function($http, $q, $cacheFactory, baseEndPoint, $window) {

    return {
        getAll : function(query) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Product' + (query ? "?" + query : ""),
                cache : true
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getById : function(productId) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Product(' + productId + ')'
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        add : function(product) {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/odata/Product';
            $http({
                method: 'POST',
                url: url,
                data : product
            }).success(function(data, status, headers, config) {
                $cacheFactory.get("$http").removeAll();
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        
        update : function(product) {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/odata/Product(' + product.productId + ')'
            $http({
                method: 'PUT',
                url: url,
                data : product
            }).success(function(data, status, headers, config) {
                $cacheFactory.get("$http").removeAll();
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        delete : function(productId) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'DELETE',
                url: baseEndPoint + '/odata/Product(' + productId + ')'
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        
        deleteImage : function(file) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'DELETE',
                url: baseEndPoint + '/api/file?filename=' + file
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
}]);
WobenProducts.factory('categoryService', ["$http", "$q", "baseEndPoint", 

function($http, $q, baseEndPoint) {

    return {
        getAll : function(query) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Category' + (query ? "?" + query : "")
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        
        getById : function(categoryId) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Category(' + productId + ')'
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        add : function(data) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'POST',
                url: baseEndPoint + '/odata/Category',
                data : data
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
}]);
WobenProducts.factory('notificationService', ["$http", "$q", "$cacheFactory", "baseEndPoint", "$window", 

function($http, $q, $cacheFactory, baseEndPoint, $window) {

    return {
        getAll : function(query) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Notification' + (query ? "?" + query : ""),
                cache : true
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getById : function(notificationId) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Notification(' + notificationId + ')'
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        add : function(notification) {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/odata/Notification';
            $http({
                method: 'POST',
                url: url,
                data : notification
            }).success(function(data, status, headers, config) {
                $cacheFactory.get("$http").removeAll();
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        update : function(notification) {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/odata/Notification(' + notification.notificationId + ')'
            $http({
                method: 'PUT',
                url: url,
                data : notification
            }).success(function(data, status, headers, config) {
                $cacheFactory.get("$http").removeAll();
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        delete : function(notificationId) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'DELETE',
                url: baseEndPoint + '/odata/Notification(' + notificationId + ')'
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }       
    }
}]);
WobenProducts.controller('AddCategoryController', ["$scope", "categoryService", "errorService", 

function($scope, categoryService, errorService) {

    $scope.addCategory = function() {
        $scope.disabled = true;
        categoryService.add({ name : $scope.name,
                              description : $scope.description
                           }).then(
            function(data) {
                $scope.disabled = false;
                $scope.categories.push(data);
                $scope.closeThisDialog();
            },
            function(error) {
                $scope.modelErrors = errorService.handleODataErrors(error);
                $scope.disabled = false;
            });
    }

    $scope.disabled = false;
}]);
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
WobenProducts.controller('AddProductController', ["$scope", "productService", "errorService", "ngDialog", "$state",
    
    function($scope, productService, errorService, ngDialog, $state) {

        $scope.addProduct = function() {
            $scope.disabled = true;
            productService.add({ name : $scope.name, isPublished : false}).then(
                function(data) {
                    $scope.disabled = false;
                    $scope.closeThisDialog();
                    $state.go("updateProduct", { productId :  data.productId });
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                    $scope.disabled = false;
                });
        }

        $scope.disabled = false;

}]);
WobenProducts.controller("NotificationListController", ["$scope", "notificationService", "errorService", "ngDialog",

	function($scope, notificationService, errorService, ngDialog) {
		
		$scope.skip = 0;
		$scope.top = 10;
                $scope.noMore = false;
                $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top + "&$expand=Product";

		notificationService.getAll($scope.odataString).then(
			function(data) {
				$scope.notifications = data;
				$scope.skip = $scope.top;			
			},
			function(error) {
				$scope.modelErrors = errorService.handleODataErrors(error);
			}
		);
		
		$scope.search = function() {
			$scope.skip = 0;
			$scope.top = 10;
                        if ($scope.query && $scope.query != "") {
                                $scope.odataString = "$skip=" + $scope.skip +
                                        "&$top=" + $scope.top  +
                                        "&$filter=substringof('" + $scope.query + "', CreatedBy)" +
                                        "or substringof('" + $scope.query + "', PhoneNumber)" +
                                        "or substringof('" + $scope.query + "', Text)" +                                        
                                        "&$expand=Product" +
                                        "&$orderby=CreatedDate desc";

                    } else {
                            $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top + "&$expand=Product";
                    }

		    notificationService.getAll($scope.odataString).then(
		              function(data) {
                              $scope.noMore = false;
					$scope.notifications = data;
					$scope.skip = $scope.top;			
				},
				function(error) {
					$scope.modelErrors = errorService.handleODataErrors(error);
				}
			);						
		};
		
		$scope.loadMore = function() {
            $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top + "&$expand=Product";
			notificationService.getAll($scope.odataString).then(
				function(data) {
                    if (data.length > 0) {
                        angular.forEach(data, function(notification, index) {
                            $scope.notifications.push(notification);
                        });
                    }
                    if (data.length < $scope.top) {
                        $scope.noMore = true;
                    }
                    $scope.skip = $scope.skip + $scope.top;
				},
				function(error) {
					$scope.modelErrors = errorService.handleODataErrors(error);
				}
			);
		};

        /**
         * Delete notification confirmation dialog
         * @param notification
         */
        $scope.sureToDelete = function(notification) {
            $scope.notificationToDelete = notification;
            $scope.dialogMessage = "¿Seguro que quieres eliminar esta notificación?"
            ngDialog.open({
                template : "/app/templates/common/dialogConfirmation.html",
                scope : $scope
            });
        };

        /**
         * Confirm deletion when the user click ok in the dialog box
         */
        $scope.confirmAction = function() {
            notificationService.delete($scope.notificationToDelete.notificationId).then(
                function(data) {
                    var index = $scope.notifications.indexOf($scope.notificationToDelete);
                    $scope.notifications.splice(index,1);
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                }
            )
        };
        
        /**
         * Check the notification details
         */
        $scope.checkNotification = function(notification) { 
            $scope.notificationDetail = notification;
            ngDialog.open({
                template : "/app/templates/products/notificationDetail.html",
                scope : $scope
            });
        };
}]);
WobenProducts.controller("IndexController", ["$scope", "$filter", "productService", "errorService", "ngDialog",

    function($scope, $filter, productService, errorService, ngDialog) {

		$scope.skip = 0;
		$scope.top = 10;
        $scope.noMore = false;        
        $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top + "&$orderby=UpdatedDate desc";
        
        productService.getAll($scope.odataString).then(       
           function(data) {
               $scope.products = data;
               $scope.skip = $scope.top;               
            },
            function(error) {
                $scope.modelErrors = errorService.handleODataErrors(error);
            });

		$scope.search = function() {
			$scope.skip = 0;
			$scope.top = 10;
            if ($scope.query && $scope.query != "") {
                $scope.odataString = "$skip=" + $scope.skip +
                    "&$top=" + $scope.top  +
                    "&$filter=substringof('" + $scope.query + "', Name)" +
                    "or substringof('" + $scope.query + "', Description)" +
                    "or substringof('" + $scope.query + "', Markdown)" +
                    "&$orderby=UpdatedDate desc";

            } else {
                $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top + "&$orderby=UpdatedDate desc";
            }

			productService.getAll($scope.odataString).then(
				function(data) {
                    $scope.noMore = false;
					$scope.products = data;
					$scope.skip = $scope.top;			
				},
				function(error) {
					$scope.modelErrors = errorService.handleODataErrors(error);
				}
			);						
		};
		
		$scope.loadMore = function() {
            $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top + "&$orderby=UpdatedDate desc";
			productService.getAll($scope.odataString).then(
				function(data) {
                    if (data.length > 0) {
                        angular.forEach(data, function(product, index) {
                            $scope.products.push(product);
                        });
                    }
                    if (data.length < $scope.top) {
                        $scope.noMore = true;
                    }
                    $scope.skip = $scope.skip + $scope.top;
				},
				function(error) {
					$scope.modelErrors = errorService.handleODataErrors(error);
				}
			);
		};                       


        $scope.sureToDelete = function(product) {
            $scope.selectedProduct = product;
            $scope.dialogMessage = "¿Seguro que quieres eliminar este producto?"
            ngDialog.open({
                template : "/app/templates/common/dialogConfirmation.html",
                scope : $scope
            });
        };

        $scope.confirmAction = function() {
            productService.delete($scope.selectedProduct.productId).then(
                function(data) {
                    var index = $scope.products.indexOf($scope.selectedProduct);
                    $scope.products.splice(index,1);
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                }
            )        
        }


        $scope.addProduct = function() {
            ngDialog.open({
                template: "/app/templates/products/addProduct.html",
                controller : "AddProductController",
                scope: $scope
            });
        }
}]);
WobenProducts.controller('PublicProductController', ["$scope", "categoryService", "productService", "utilsService", "errorService", "baseEndPoint", "TypeaheadData", "$state",

    function($scope, categoryService, productService, utilsService, errorService, baseEndPoint, TypeaheadData, $state) {

		$scope.skip = 0;
		$scope.top = 6;
        $scope.noMore = false;

        $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top + "&$orderby=UpdatedDate desc&$expand=Category";
        $scope.searchModel = "";

        var products = new Bloodhound({
            datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.name); },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local : TypeaheadData
        });

        products.initialize();

        // Typeahead options object
        $scope.searchOptions = {
            highlight: true
        };

        // Single dataset example
        $scope.searchData = {
            displayKey: 'name',
            source: products.ttAdapter()
        };

        // Get categories
        categoryService.getAll().then(
            function(data) {
                $scope.categories = data;
            },
            function(error) {
               $scope.modelErrors = errorService.handleODataErrors(error);
            });

        productService.getAll($scope.odataString).then(
            function(data) {
                $scope.noMore = false;
                $scope.products = data;
                $scope.skip = $scope.top;
                utilsService.addDummyProduct($scope.products, $scope.products.length);
                $scope.pagedProducts = utilsService.groupToPages($scope.products, 3);                
            },
            function(error) {
                $scope.modelErrors = errorService.handleODataErrors(error);
            });

        $scope.search = function() {
			$scope.skip = 0;
			$scope.top  = 6;            
            $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top +             
                                 "&$filter=substringof('" + $scope.searchModel + "', Name) or " +
                                  "substringof('" + $scope.searchModel + "', Description) or " +
                                  "substringof('" + $scope.searchModel + "', Markdown)" +
                                  "&$orderby=UpdatedDate desc&$expand=Category";

            productService.getAll($scope.odataString).then(
                function(data) {
                    $scope.products = data;
                    if (data.length < $scope.top) {
                        $scope.noMore = true;
                    } else {
                        $scope.noMore = false;
                    }                                        
                    $scope.skip = $scope.top;
                    utilsService.addDummyProduct($scope.products, $scope.products.length);
                    $scope.pagedProducts = utilsService.groupToPages($scope.products, 3);
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                });
        };

        $scope.loadMore = function() {
            $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top +
                                 "&$filter=(substringof('" + $scope.searchModel + "', Name) or " +
                                  "substringof('" + $scope.searchModel + "', Description) or " +
                                  "substringof('" + $scope.searchModel + "', Markdown)"   +          
                                  ($scope.selectedCategoryId ? ") and CategoryId eq " + $scope.selectedCategoryId : ")") +
                                  "&$orderby=UpdatedDate desc&$expand=Category"; 
                                  
            productService.getAll($scope.odataString).then(
                function(data) {
                    angular.forEach(data, function(product, index) {
                        $scope.products.push(product);
                    });
                    if (data.length < $scope.top) {
                        $scope.noMore = true;
                    }                    
                    $scope.skip = $scope.skip + $scope.top;
                    utilsService.addDummyProduct($scope.products, $scope.products.length);                    
                    $scope.pagedProducts = utilsService.groupToPages($scope.products, 3);
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                });
        };

        $scope.filterByCategory = function(categoryId) {
			$scope.skip = 0;
			$scope.top  = 6;            
            $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top +
                                 "&$filter=(substringof('" + $scope.searchModel + "', Name) or " +
                                  "substringof('" + $scope.searchModel + "', Description) or " +
                                  "substringof('" + $scope.searchModel + "', Markdown)"   +          
                                  ") and CategoryId eq " + categoryId +
                                  "&$orderby=UpdatedDate desc&$expand=Category";

            productService.getAll($scope.odataString).then(
                function(data) {
                    $scope.products = data;
                    if (data.length < $scope.top) {
                        $scope.noMore = true;
                    } else {
                        $scope.noMore = false;
                    }                                                  
                    utilsService.addDummyProduct($scope.products, $scope.products.length);
                    $scope.pagedProducts = utilsService.groupToPages($scope.products, 3);
                    $scope.selectedCategoryId = categoryId;
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                });
        };
        
        $scope.navigateToDetail = function(product) {
            $state.go("viewPublicProduct", { urlCode : product.urlCodeReference });
        };
}]);

WobenProducts.controller('UpdateProductController', ["$scope", "productService", "errorService", "categoryService", "ngDialog", "$sce", "$stateParams","$q", "baseEndPoint", "$timeout",

function($scope, productService, errorService, categoryService, ngDialog, $sce, $stateParams,$q, baseEndPoint, $timeout) {

    $scope.tags = "";
    
    $scope.updateProduct = function() {
        $scope.disabled = true;
        $scope.product.html = marked($scope.product.markdown ? $scope.product.markdown : "");
        $scope.product.category = null;
        productService.update($scope.product).then(
            function(data) {
                productService.getAll("$filter=ProductId eq " + $stateParams.productId + "&$expand=Tags,Features,Category").then(
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

    $q.all([ productService.getAll("$filter=ProductId eq " + $stateParams.productId + "&$expand=Tags,Features,Category"), categoryService.getAll()])
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
WobenProducts.controller("ViewPublicProductController", ["$scope", "$stateParams", "productService", "notificationService", "errorService", "$window", "$sce", "accountService", "ngDialog",
	function($scope, $stateParams, productService, notificationService, errorService, $window, $sce, accountService, ngDialog) {

        $scope.User = accountService.User;

	$scope.notification = { }
        $scope.notification.bestTimeToCall = "I";

	if ($stateParams.urlCode != "preview") {
	       productService.getAll("$expand=Category,Tags,Features&$filter=UrlCodeReference eq '" + $stateParams.urlCode + "'").then(
			function(data) {
		      	       $scope.product = data[0];
                                $scope.notification.productId = $scope.product.productId;
				if ($scope.product.html) {
				    $scope.trustedHtml = $sce.trustAsHtml($scope.product.html);						
				}
                                startupKit.uiKitBlog.blog1();
			},
			function(error) {
				$scope.modelErrors = errorService.handleODataErrors(error);
			}			
		)										
	}

	$scope.sendNotification = function() {
	       if (!$scope.notification.phoneNumber) {
                        $scope.dialogMessage = "No has dejado ningún teléfono, te contactaremos por mail. ¿Quieres continuar?"
                        ngDialog.open({
                                template : "/app/templates/common/dialogConfirmation.html",
                                scope : $scope
                        });
                } else {
                        startSendingNotification();
                }
	}

        $scope.confirmAction = function() {
            startSendingNotification();
        }

        $scope.showNotificationMessage = false;

        $scope.$watch("notification", function(newVal) {
            $scope.showNotificationMessage = false;
        }, true);

        $scope.sendAnotherMessage = function() {
            $scope.showNotificationMessage = false;
            $scope.notification = { };
            $scope.notification.bestTimeToCall = "I";
            $scope.notification.productId = $scope.product.productId;
        }

	$scope.updatePreviewData = function(product) {
		if (product.html) {					
			$scope.trustedHtml = $sce.trustAsHtml(product.html);
		}				
		$scope.$apply(function(){
           	    $scope.product = product;
                });
        }
        
        function startSendingNotification() {
            notificationService.add($scope.notification).then(
                function(data) {
                    $scope.showNotificationMessage = true;
                },
                function(error) {
                    $scope.notificationModelErrors = errorService.handleODataErrors(error);
                });
        }        
    }
]);