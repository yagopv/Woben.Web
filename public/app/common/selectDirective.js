WobenCommon.directive('woSelect', function() {
    return {
        link : function(scope, element, attrs) {
            angular.element(element).selectpicker({style: 'btn-primary', menuStyle: 'dropdown-inverse'});
        },
        restrict: 'E',
        replace : true,
        scope: {
            title : "@",            
            value : "@",
            description : "@",
            options : "=",
            ngModel : "="
        },
        templateUrl: '/app/templates/common/selectDirective.html'
    };
});