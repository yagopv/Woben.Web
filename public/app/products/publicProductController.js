WobenProducts.controller('PublicProductController',
    ["$scope", "categoryService", "productService", function($scope, categoryService, productService) {

    // Get categories
    categoryService.getAll().then(
        function(data) {
            $scope.categories = data;
        },
        function(error) {
           $scope.modelErrors = errorService.handleODataErrors(error);
        });

    productService.getAll("$top=10&$orderby=UpdatedDate desc&$expand=Category").then(
        function(data) {
            $scope.products = data;
        },
        function(error) {
            $scope.modelErrors = errorService.handleODataErrors(error);
        });

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
