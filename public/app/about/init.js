var WobenAbout = angular.module('WobenAbout',['ui.router']);

WobenAbout.config(function($stateProvider) {
        $stateProvider
            .state('about', {
                url: "/about",
                controller:  "AboutController",
                templateUrl: "/app/templates/about/about.html"
            })
        });