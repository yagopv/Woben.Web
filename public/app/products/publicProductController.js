WobenProducts.controller('PublicProductController', ["$scope", "categoryService", "productService", "utilsService", "errorService", "baseEndPoint", "TypeaheadData",

    function($scope, categoryService, productService, utilsService, errorService, baseEndPoint, TypeaheadData) {

        $scope.searchModel = null;

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

        productService.getAll("$top=6&$orderby=UpdatedDate desc&$expand=Category").then(
            function(data) {
                $scope.products = data;
                utilsService.addDummyProduct($scope.products, $scope.products.length);
                $scope.pagedProducts = utilsService.groupToPages($scope.products, 3);
            },
            function(error) {
                $scope.modelErrors = errorService.handleODataErrors(error);
            });

        $scope.search = function() {
            productService.getAll("$filter=substringof('" + $scope.searchModel + "', Name) or " +
                                  "substringof('" + $scope.searchModel + "', Description) or " +
                                  "substringof('" + $scope.searchModel + "', Markdown)" +
                                  "&$top=6&$orderby=UpdatedDate desc&$expand=Category").then(
                function(data) {
                    $scope.products = data;
                    utilsService.addDummyProduct($scope.products, $scope.products.length);
                    $scope.pagedProducts = utilsService.groupToPages($scope.products, 3);
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                });
        };

        $scope.loadMore = function() {
            productService.getAll("$skip=" +
                                  $scope.products.length +
                                  ($scope.selectedCategoryId ? "&$filter=CategoryId eq " + $scope.selectedCategoryId : "") +
                                  "&$top=6&$orderby=UpdatedDate desc&$expand=Category").then(
                function(data) {
                    angular.forEach(data, function(product, index) {
                        $scope.products.push(product);
                    });
                    utilsService.addDummyProduct($scope.products, $scope.products.length);
                    $scope.pagedProducts = utilsService.groupToPages($scope.products, 3);
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                });
        };

        $scope.filterByCategory = function(categoryId) {
            productService.getAll("&$top=6&$filter=CategoryId eq " + categoryId + "&$orderby=UpdatedDate desc&$expand=Category").then(
                function(data) {
                    $scope.products = data;
                    utilsService.addDummyProduct($scope.products, $scope.products.length);
                    $scope.pagedProducts = utilsService.groupToPages($scope.products, 3);
                    $scope.selectedCategoryId = categoryId;
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                });
        };
}]);
