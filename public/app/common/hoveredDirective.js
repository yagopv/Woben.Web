WobenCommon.directive('woHovered', function () {
    return {
        restrict: 'A',
        scope: {
            woHovered: '@'
        },
        link: function (scope, element) {
            element.on('mouseenter', function() {
                element.addClass(scope.woHovered);
            });
            element.on('mouseleave', function() {
                element.removeClass(scope.woHovered);
            });
        }
    };
});