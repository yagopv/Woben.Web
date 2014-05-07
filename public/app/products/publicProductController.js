WobenProducts.controller('PublicProductController', ["$scope", "categoryService", "productService", "utilsService",

    function($scope, categoryService, productService, utilsService) {

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

    // Typeahead
    var numbers = new Bloodhound({
        datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.num); },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: [
            { num: 'one' },
            { num: 'two' },
            { num: 'three' },
            { num: 'four' },
            { num: 'five' },
            { num: 'six' },
            { num: 'seven' },
            { num: 'eight' },
            { num: 'nine' },
            { num: 'ten' }
        ]
    });

    // initialize the bloodhound suggestion engine
    numbers.initialize();

    // Allows the addition of local datum
    // values to a pre-existing bloodhound engine.
    $scope.addValue = function () {
        numbers.add({
            num: 'twenty'
        });
    };

    // Typeahead options object
    $scope.searchOptions = {
        highlight: true
    };

    // Single dataset example
    $scope.searchData = {
        displayKey: 'num',
        source: numbers.ttAdapter()
    };

    $scope.searchModel = null;
}]);
