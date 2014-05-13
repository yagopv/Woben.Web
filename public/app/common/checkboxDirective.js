WobenCommon.directive('woCheckbox', function() {
    return {
        link : function(scope, element, attrs) {
            var $checkbox = $(element).find('[data-toggle=checkbox]');
            $checkbox.checkbox();

            if (scope.value == "true") {
                scope.ngModel = true;
                $checkbox.checkbox("check");
            } else {
                scope.ngModel = false;
                $checkbox.checkbox("uncheck");
            }

            $(element).on("click", function() {
                scope.ngModel = !($checkbox.is(":checked"));
                if (scope.ngModel == true) {
                    $checkbox.checkbox("check");
                } else {
                    $checkbox.checkbox("uncheck");
                }
                scope.$apply();
                return false;
            });

            attrs.$observe('value', function(newValue) {
                if (newValue == "true") {
                    $checkbox.checkbox("check");
                } else {
                    $checkbox.checkbox("uncheck");
                }
            });
        },
        restrict: 'E',
        replace : true,
        scope: {
            label: '@',
            value : '@',
            ngModel : "="
        },
        controller : function() {

        },
        templateUrl: '/app/templates/common/checkboxDirective.html'
    };
});