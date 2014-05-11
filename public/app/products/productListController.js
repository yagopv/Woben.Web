WobenProducts.controller("IndexController", function($scope, $filter, productService, errorService, ngDialog) {

   productService.getAll("$orderby=UpdatedDate desc").then(
       function(data) {
           $scope.products = data;
           $scope.search();
       },
       function(error) {
           $scope.modelErrors = errorService.handleODataErrors(error);
       });

    $scope.deleteProduct = function(product) {
        productService.delete(product.productId).then(
            function(data) {
                var index = $scope.products.indexOf(product);
                $scope.products.splice(index,1);
                $scope.search();
                $scope.selectedProduct = null;
            },
            function(error) {
                $scope.modelErrors = errorService.handleODataErrors(error);
                $scope.selectedProduct = null;
            }
        )
    }

    $scope.sureToDelete = function(product) {
        $scope.selectedProduct = product;
        $scope.dialogMessage = "¿Seguro que quieres eliminar este producto?"
        ngDialog.open({
            template : "/app/templates/common/dialogConfirmation.html",
            scope : $scope
        });
    }

    $scope.confirmAction = function() {
        $scope.deleteProduct($scope.selectedProduct);
    }

    /* Pagination */
    $scope.sortingOrder = "updatedDate";
    $scope.reverse = true;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;    
    $scope.products = [];

    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.products, function (product) {
            for(var attr in product) {
                if (searchMatch(product[attr].toString(), $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };
    
    $scope.groupToPages = function () {
        $scope.pagedItems = [];
        
        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };
    
    $scope.range = function (start, end) {
        var ret = [];
        if (!end) {
            end = start;
            start = 0;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };
    
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };
    
    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    $scope.sortBy = function(newSortingOrder) {
        if ($scope.sortingOrder == newSortingOrder)
            $scope.reverse = !$scope.reverse;

        $scope.sortingOrder = newSortingOrder;

    };

    $scope.addProduct = function() {
        ngDialog.open({
            template: "/app/templates/products/addProduct.html",
            controller : "AddProductController",
            scope: $scope
        });
    }
});