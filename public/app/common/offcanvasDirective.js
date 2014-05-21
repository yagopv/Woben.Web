WobenCommon.directive('woOffcanvas', function($window) {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        scope :  {
          activeTransitions : "@",
          noAdditional : "@",
          noMenu : "@"
        },
        controller : function($scope) {
            $scope.windowWidth = $window.innerWidth;
            $scope.activeMenu = false;
            $scope.activeAdditional = false;

            this.toggleMenu = function() {
                if ($scope.windowWidth < 768) {
                    $scope.activeMenu = !$scope.activeMenu;
                } else {
                    if ($scope.windowWidth >= 768 && $scope.windowWidth < 978) {
                        $scope.activeMenu = false;
                    } else {
                        $scope.activeMenu = false;
                        $scope.activeAdditional = false;
                    }
                }
            };
            this.toggleAdditional = function() {
                if ($scope.windowWidth < 768) {
                    $scope.activeAdditional = !$scope.activeAdditional;
                } else {
                    if ($scope.windowWidth >= 768 && $scope.windowWidth < 978) {
                        $scope.activeAdditional = !$scope.activeAdditional;
                    } else {
                        $scope.activeMenu = false;
                        $scope.activeAdditional = false;
                    }
                }
            };
            $scope.getWidth = function() {
                return $window.innerWidth;
            };

            $scope.$watch($scope.getWidth, function(newValue, oldValue) {
                $scope.windowWidth = newValue;
            });

            window.onresize = function(){
                $scope.$apply();
            }
        },
        template: '<div class="st-offcanvas" ng-class="{activemenu : activeMenu, activeadditional : activeAdditional }" ng-transclude></div>',
        link: function(scope, element, attrs, $window) {
            if (scope.activeTransitions == "true") {
                element.addClass("active-transitions");
            }
            
            if (scope.noAdditional == "true") {
                element.addClass("no-additional");
            }
            
            if (scope.noMenu == "true") {
                element.addClass("no-menu");
            }
        }
    }
});

WobenCommon.directive('woOffcanvasMenu', function() {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        template: '<div class="st-offcanvas-menu" ng-transclude></div>'
    };
});

WobenCommon.directive('woOffcanvasMain', function($window) {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        require : "^woOffcanvas",
        template: '<div class="st-offcanvas-main">' +
                        '<div class="container-fluid buttonsContainer">' +
                            '<a href="javascript:;" class="showmenubutton" ng-show="visibleMenu" ng-click="toggleMenu()"><span class="fui-list"></span></a>' +
                            //'<a href="javascript:;" class="showadditionalbutton" ng-show="visibleAdditional" ng-click="toggleAdditional()"><span class="fui-list"></span></a>' +
                        '</div>' +
                        '<div ng-transclude></div>' +
                  '</div>',
        controller : function($scope) {
            $scope.windowWidth = $window.innerWidth;

            $scope.getWidth = function() {
                return $window.innerWidth;
            };

            $scope.$watch($scope.getWidth, function(newValue, oldValue) {
                $scope.windowWidth = newValue;
            });

            $window.onresize = function(){
                $scope.$apply();
                calculateMinHeight();
                checkButtonsVisibility();
            }

            var calculateMinHeight = function() {
                var minHeight = $window.innerHeight -
                    angular.element("footer").height();
                    angular.element(".st-offcanvas-main").css("min-height", minHeight);
                    console.log(minHeight);
            };

            var checkButtonsVisibility = function() {
                if ($scope.windowWidth < 768) {
                    $scope.visibleMenu = true;
                    $scope.visibleAdditional = true;
                } else {
                    if ($scope.windowWidth >= 768 && $scope.windowWidth < 978) {
                        $scope.visibleMenu = false;
                        $scope.visibleAdditional = true;
                    } else {
                        $scope.visibleMenu = false;
                        $scope.visibleAdditional = false;
                    }
                }
            };

            calculateMinHeight();
            checkButtonsVisibility();
        },
        link: function($scope, element, attrs, offcanvas) {
            $scope.toggleMenu = offcanvas.toggleMenu;
            $scope.toggleAdditional = offcanvas.toggleAdditional;
        }
    };
});

WobenCommon.directive('woOffcanvasAdditional', function() {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        require: '^woOffcanvas',
        template: '<div  class="st-offcanvas-additional" ng-transclude></div>'
    };
});
