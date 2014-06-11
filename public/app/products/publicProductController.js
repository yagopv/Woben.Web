WobenProducts.controller('PublicProductController', ["$scope", "categoryService", "productService", "utilsService", "errorService", "baseEndPoint", "TypeaheadData", "$state",

    function($scope, categoryService, productService, utilsService, errorService, baseEndPoint, TypeaheadData, $state) {

		$scope.skip = 0;
		$scope.top = 6;
        $scope.noMore = false;
        $scope.baseEndPoint = baseEndPoint;
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
