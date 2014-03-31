WobenCommon.directive('woFileInput', function() {
    return {
        link : function(scope, element, attrs) {
            new $.fn.fileinput.Constructor('[data-provides="fileinput"]');
        },
        restrict: 'E',
        replace : true,
        scope: {
            selectText: '@',
            updateText : '@',
            deleteText : '@',
            ngModel : "="
        },
        templateUrl: '/app/templates/common/fileInputDirective.html'
    };
});
