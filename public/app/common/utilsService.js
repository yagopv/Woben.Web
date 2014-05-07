WobenCommon.factory('utilsService', function() {

    return {
        groupToPages : function(collection, itemsPerPage) {
            var pagedItems = [];

            for (var i = 0; i < collection.length; i++) {
                if (i % itemsPerPage === 0) {
                    pagedItems[Math.floor(i / itemsPerPage)] = [ collection[i] ];
                } else {
                    pagedItems[Math.floor(i / itemsPerPage)].push(collection[i]);
                }
            }

            return pagedItems;
        },

        addDummyProduct : function(products) {
            var len = products.length;
            if ((len % 3) == 2) {
                products.push({
                   categoryId : Number.MAX_VALUE,
                   dummy : true
                });
            }
        }
    }
});
