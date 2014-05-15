WobenCommon.directive('woRadio', function() {
    return {
        link : function(scope, element, attrs) {
            var $radio = $(element).find(':radio');
            $radio.radio();
            
            $(':radio').on('toggle', function(event) {
                scope.ngModel = $(event.target).val();
            });
        },
        scope : {
            ngModel : "="
        },
        restrict: 'EAC'
    };
});