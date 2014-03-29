WobenCommon.directive('woErrors', function() {
    return {
        restrict: 'E',
        replace : true,
        scope: {
            errors : "=",
            title : "@"
        },
        templateUrl: '/app/templates/common/errorDirective.html'
    };
});