var WobenContact = angular.module('WobenContact',['ui.router']);

WobenContact.config(["$stateProvider", function($stateProvider) {
        $stateProvider
            .state('contact', {
                url: "/contact",
                controller:  "ContactController",
                templateUrl: "/app/templates/contact/contact.html"
            })
            .state('messageList', {
                url: "/dashboard/message/index",
                controller:  "MessageListController",
                templateUrl: "/app/templates/contact/messageList.html",
                resolve: {
                    User: ["$state", "accountService", function($state, accountService) {
                        return accountService.isUserInRole(["Administrator"]).then(
                            function(data) {
                                return data;
                            },
                            function(error) {
                                $state.go('signin');
                            }
                        );
                    }]
                }
            });
        }]);

WobenContact.value("baseEndPoint", "https://woben.azurewebsites.net");
WobenContact.factory('messageService', ["$http", "$q", "$cacheFactory", "baseEndPoint", "$window",
    function($http, $q, $cacheFactory, baseEndPoint, $window) {

    return {
        getAll : function(query) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Message' + (query ? "?" + query : ""),
                cache : true
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getById : function(messageId) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'GET',
                url: baseEndPoint + '/odata/Message(' + messageId + ')'
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        add : function(message) {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/odata/Message';
            $http({
                method: 'POST',
                url: url,
                data : message
            }).success(function(data, status, headers, config) {
                $cacheFactory.get("$http").removeAll();
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        
        update : function(message) {
            var deferred = $q.defer(),
                self = this,
                url = baseEndPoint + '/odata/Message(' + message.messageId + ')'
            $http({
                method: 'PUT',
                url: url,
                data : message
            }).success(function(data, status, headers, config) {
                $cacheFactory.get("$http").removeAll();
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        delete : function(messageId) {
            var deferred = $q.defer(),
                self = this;
            $http({
                method: 'DELETE',
                url: baseEndPoint + '/odata/Message(' + messageId + ')'
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }       
    }
}]);
WobenContact.controller('ContactController', ["$scope", "messageService", "errorService",
    
    function($scope, messageService, errorService) {

        $scope.disabled = false;
        $scope.showConfirmationMessage = false;
        $scope.showNotificationMessage = false;
                
        $scope.sendMessage = function() {
            $scope.disabled = true;
            messageService.add($scope.message).then(
                function(data) {
                    $scope.disabled = false;
                    $scope.showConfirmationMessage = true; 
                    $scope.showNotificationMessage = true;                   
                },
                function(error) {
                    $scope.disabled = false;
                    $scope.modelErrors = errorService.handleODataErrors(error);
                }
            );
        };
        
        $scope.sendAnotherMessage = function() {
            $scope.showNotificationMessage = false;
        };             
}]);
WobenContact.controller('MessageListController', ["$scope", "messageService", "errorService", "ngDialog",
    
    function($scope, messageService, errorService, ngDialog) {
		
		$scope.skip = 0;
		$scope.top = 10;
        $scope.noMore = false;
        $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top;

		messageService.getAll($scope.odataString).then(
			function(data) {
				$scope.messages = data;
				$scope.skip = $scope.top;			
			},
			function(error) {
				$scope.modelErrors = errorService.handleODataErrors(error);
			}
		);
		
		$scope.search = function() {
			$scope.skip = 0;
			$scope.top = 10;
            if ($scope.query && $scope.query != "") {
                $scope.odataString = "$skip=" + $scope.skip +
                    "&$top=" + $scope.top  +
                    "&$filter=substringof('" +  $scope.query + "',CreatedBy)" +
                    " or substringof('"     +  $scope.query + "',PhoneNumber)" +             
                    " or substringof('"     +  $scope.query + "',Name)" +
                    " or substringof('"     +  $scope.query + "',Email)" +
                    " or substringof('"     +  $scope.query + "',Text)" +
                    "&$orderby=CreatedDate desc";

            } else {
                $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top;
            }

			messageService.getAll($scope.odataString).then(
				function(data) {
                    $scope.noMore = false;
					$scope.messages = data;
					$scope.skip = $scope.top;			
				},
				function(error) {
					$scope.modelErrors = errorService.handleODataErrors(error);
				}
			);						
		};
		
		$scope.loadMore = function() {
            $scope.odataString = "$skip=" + $scope.skip + "&$top=" + $scope.top;
			messageService.getAll($scope.odataString).then(
				function(data) {
                    if (data.length > 0) {
                        angular.forEach(data, function(message, index) {
                            $scope.messages.push(message);
                        });
                    }
                    if (data.length < $scope.top) {
                        $scope.noMore = true;
                    }
                    $scope.skip = $scope.skip + $scope.top;
				},
				function(error) {
					$scope.modelErrors = errorService.handleODataErrors(error);
				}
			);
		};

        /**
         * Delete message confirmation dialog
         * @param message
         */
        $scope.sureToDelete = function(message) {
            $scope.messageToDelete = message;
            $scope.dialogMessage = "¿Seguro que quieres eliminar esta notificación?"
            ngDialog.open({
                template : "/app/templates/common/dialogConfirmation.html",
                scope : $scope
            });
        };

        /**
         * Confirm deletion when the user click ok in the dialog box
         */
        $scope.confirmAction = function() {
            messageService.delete($scope.messageToDelete.messageId).then(
                function(data) {
                    var index = $scope.messages.indexOf($scope.messageToDelete);
                    $scope.messages.splice(index,1);
                },
                function(error) {
                    $scope.modelErrors = errorService.handleODataErrors(error);
                }
            )
        };
        
        /**
         * Check the message details
         */
        $scope.checkMessage = function(message) {
            $scope.messageDetail = message;
            ngDialog.open({
                template : "/app/templates/contact/messageDetail.html",
                scope : $scope
            });            
        };
}]);