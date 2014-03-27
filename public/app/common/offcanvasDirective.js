WobenCommon.directive('woOffcanvas', function() {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        scope :  {
          activeTransitions : "@",
          noAdditional : "@",
          noMenu : "@"
        },
        template: '<div class="st-offcanvas" ng-transclude></div>',
        controller: function($scope) {
            //this.addChild = function() { 

            //};
        },
        link: function(scope, element, attrs, parentController) {
            if (scope.activeTransitions == "true") {
                angular.element(element).addClass("active-transitions");
            }
            
            if (scope.noAdditional == "true") {
                angular.element(element).addClass("no-additional");
            }
            
            if (scope.noMenu == "true") {
                angular.element(element).addClass("no-menu");
            }
            
            this.activeAdditional = function() {
                angular.element(element).addClass("active-additional");
                angular.element(element).removeClass("active-menu");
            }
            
            this.activeMenu = function() {
                angular.element(element).addClass("active-menu");
                angular.element(element).removeClass("active-additional");
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

WobenCommon.directive('woOffcanvasMain', function() {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        require: '^woOffcanvas',
        template: '<div class="st-offcanvas-main"><a href="#" class="showmenubutton"></a><a href="#" class="showadditionalbutton"></a><div ng-transclude></div></div>',
        link: function(scope, elem, attrs, parentController) {
            
        }        
    };
});

WobenCommon.directive('woOffcanvasAdditional', function() {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        template: '<div  class="st-offcanvas-additional" ng-transclude></div>'
    };
});
