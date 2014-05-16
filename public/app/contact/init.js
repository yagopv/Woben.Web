var WobenContact = angular.module('WobenContact',['ui.router']);

WobenContact.config(function($stateProvider) {
        $stateProvider
            .state('contact', {
                url: "/contact",
                controller:  "ContactController",
                templateUrl: "/app/templates/contact/contact.html"
            })
        })
        .state('messageList', {
            url: "/dashboard/message/index",
            controller:  "MessageListController",
            templateUrl: "/app/templates/contact/messageList.html",
            resolve: {
                User: function($state, $stateParams, $q, accountService) {
                    return accountService.isUserInRole(["Administrator"]).then(
                        function(data) {
                            return data;
                        },
                        function(error) {
                            $state.go('signin');
                        }
                    );
                }
            }
        });         

WobenContact.value("baseEndPoint", "https://woben.azurewebsites.net");