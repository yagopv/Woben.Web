Woben.directive('woErrors', function() {
    return {
        restrict: 'E',
        replace : true,
        scope: {
            errors : "=",
            title : "@"
        },
        templateUrl: '/app/common/errorDirective.html'
    };
});