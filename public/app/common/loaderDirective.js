WobenCommon.directive("woLoader", function ($rootScope) {
        return {
            link : function($scope, element, attrs) {
                $scope.$on("woben:loadershow", function () {
                    return element.show();
                });
                return $scope.$on("woben:loaderhide", function () {
                    return element.hide();
                });
            },
            restrict: 'E',
            replace : true,
            templateUrl: '/app/templates/common/loaderDirective.html'
        };
    }
)