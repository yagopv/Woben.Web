Woben.directive('woOffcanvas', function() {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        template: '<div class="st-offcanvas" ng-transclude></div>'
    };
});

Woben.directive('woOffcanvasMenu', function() {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        template: '<div class="st-offcanvas-menu" ng-transclude></div>'
    };
});

Woben.directive('woOffcanvasMain', function() {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        template: '<div class="st-offcanvas-main"><a href="#" class="showmenubutton"></a><a href="#" class="showadditionalbutton"></a><div ng-transclude></div></div>'
    };
});

Woben.directive('woOffcanvasAdditional', function() {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        template: '<div  class="st-offcanvas-additional" ng-transclude></div>'
    };
});
