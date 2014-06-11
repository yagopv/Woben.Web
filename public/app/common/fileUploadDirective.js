/**
 * Github angular-file-upload
 */
WobenCommon.directive('woFileUpload', ["baseEndPoint", "$window", function(baseEndPoint, $window) {
    return {
        link : function($scope, element, attrs) { 
            if (attrs.maxFiles && parseInt(attrs.maxFiles) > 1) {
                angular.element(element).find("input[type=file]").attr("multiple", "multiple");
            }
        },
        restrict: 'E',
        replace : true,
        scope: {
            selectText: '@',
            updateText : '@',
            deleteText : '@',
            maxFiles : "@",
            uploadRightAway : "@",
            ngModel : "=",
            entityId : "="
        },
        controller : ["$scope", "$http", "$timeout", "$upload", "$element",
            function($scope, $http, $timeout, $upload, $element) {                       
                            
            	$scope.fileReaderSupported = window.FileReader != null;
            	$scope.changeAngularVersion = function() {
            		window.location.hash = $scope.angularVersion;
            		window.location.reload(true);
            	}
            	$scope.hasUploader = function(index) {
            		return $scope.upload[index] != null;
            	};
            	$scope.abort = function(index) {
            		$scope.upload[index].abort(); 
            		$scope.upload[index] = null;
            	};
            	$scope.angularVersion = window.location.hash.length > 1 ? window.location.hash.substring(1) : '1.2.0';
            	$scope.onFileSelect = function($files) {
            		$scope.selectedFiles = [];
            		$scope.progress = [];
            		if ($scope.upload && $scope.upload.length > 0) {
            			for (var i = 0; i < $scope.upload.length; i++) {
            				if ($scope.upload[i] != null) {
            					$scope.upload[i].abort();
            				}
            			}
            		}
            		$scope.upload = [];
            		$scope.uploadResult = [];
            		$scope.selectedFiles = $files;
            		$scope.dataUrls = [];

            		for ( var i = 0; i < $files.length; i++) {
            			var $file = $files[i];
            			if (window.FileReader && $file.type.indexOf('image') > -1) {
            				var fileReader = new FileReader();
            				fileReader.readAsDataURL($files[i]);
            				var loadFile = function(fileReader, index) {
            					fileReader.onload = function(e) {
            						$timeout(function() {
            							$scope.dataUrls[index] = e.target.result;
            						});
            					}
            				}(fileReader, i);
            			}
            			$scope.progress[i] = -1;
            			if ($scope.uploadRightAway && $scope.uploadRightAway == "true") {
            				$scope.start(i);
            			}
            		}
            	}
            
            	$scope.start = function(index) {
            		$scope.progress[index] = 0;    
            		$scope.upload[index] = $upload.upload({
            			url : baseEndPoint + '/api/file',
            			method: "POST",
            			headers: { },
            			data : { },
            			file: $scope.selectedFiles[index],
            			fileFormDataName: 'File'
            		}).then(function(response) {
                        var file = response.data[0];
            			$scope.ngModel.push({
                            imageId : 0,
                            name : file.name,
                            productId : $scope.entityId,
                            url : file.url                            
                        });
            		}, null, function(evt) {
            			$scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
            		}).xhr(function(xhr){
            			xhr.upload.addEventListener('abort', function(){console.log('aborted complete')}, false);
                    });
            	}                   
            }
        ],
        templateUrl: '/app/templates/common/fileUploadDirective.html'
    };
}]);
