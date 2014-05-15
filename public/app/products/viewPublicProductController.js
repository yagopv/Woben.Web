WobenProducts.controller("ViewPublicProductController", ["$scope", "$stateParams", "productService", "errorService", "$window", "$sce", "accountService", "ngDialog",
	function($scope, $stateParams, productService, errorService, $window, $sce, accountService, ngDialog) {

        $scope.User = accountService.User;

		$scope.notification = { }
        $scope.notification.bestTimeToCall = "I";

		if ($stateParams.urlCode != "preview") {
			productService.getAll("$expand=Category,Tags,Features&$filter=UrlCodeReference eq '" + $stateParams.urlCode + "'").then(
				function(data) {
					$scope.product = data[0];
                    $scope.notification.productId = $scope.product.productId;
					if ($scope.product.html) {
						$scope.trustedHtml = $sce.trustAsHtml($scope.product.html);						
					}
                    startupKit.uiKitBlog.blog1();
				},
				function(error) {
					$scope.modelErrors = errorService.handleODataErrors(error);
				}			
			)										
		}

		$scope.sendNotification = function() {
			if (!$scope.notification.phoneNumber) {
                $scope.dialogMessage = "No has dejado ningún teléfono, te contactaremos por mail. ¿Quieres continuar?"
                ngDialog.open({
                    template : "/app/templates/common/dialogConfirmation.html",
                    scope : $scope
                });
            } else {
                startSendingNotification();
            }
		}

        $scope.confirmAction = function() {
            startSendingNotification();
        }

        $scope.showNotificationMessage = false;

        $scope.$watch("notification", function(newVal) {
            $scope.showNotificationMessage = false;
        }, true);

        function startSendingNotification() {
            productService.addNotification($scope.notification).then(
                function(data) {
                    $scope.showNotificationMessage = true;
                },
                function(error) {
                    $scope.notificationModelErrors = errorService.handleODataErrors(error);
                });
        }

        $scope.sendAnotherMessage = function() {
            $scope.showNotificationMessage = false;
            $scope.notification = { };
            $scope.notification.bestTimeToCall = "I";
            $scope.notification.productId = $scope.product.productId;
        }

		$scope.updatePreviewData = function(product) {
			if (product.html) {					
				$scope.trustedHtml = $sce.trustAsHtml(product.html);
			}				
			$scope.$apply(function(){
            	$scope.product = product;
          	});
		}
	}
]);