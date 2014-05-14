var WobenContact = angular.module('WobenContact',['ui.router']);

WobenContact.config(function($stateProvider) {
        $stateProvider
            .state('contact', {
                url: "/contact",
                controller:  "ContactController",
                templateUrl: "/app/templates/contact/contact.html"
            })
        });

WobenContact.value("baseEndPoint", "https://woben.azurewebsites.net");