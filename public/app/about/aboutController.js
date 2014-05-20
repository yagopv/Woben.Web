WobenContact.controller('AboutController', ["$scope", "$timeout",
    
    function($scope, $timeout) {
        /**
         * Initialize Content-31 component
         */
        startupKit.uiKitContent.content31();
        // The timeout is neccesary for allow definitives width and height
        // of each slider

        $timeout(function() {
            $(window).trigger("resize");
            $(window).trigger("scroll");            
        }, 500);       
}]);