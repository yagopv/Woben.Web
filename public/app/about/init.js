var WobenAbout = angular.module('WobenAbout',['ui.router']);

WobenAbout.config(["$stateProvider", function($stateProvider) {
        $stateProvider
            .state('about', {
                url: "/about",
                controller:  "AboutController",
                templateUrl: "/app/templates/about/about.html"
            })
        }]);