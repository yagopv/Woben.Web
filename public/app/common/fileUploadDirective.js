WobenCommon.directive('woFileUpload', ["baseEndPoint", "$window", function(baseEndPoint, $window) {
    return {
        link : function($scope, element, attrs) {
            if (attrs.maxFiles && parseInt(attrs.maxFiles) == 1) {
                return
            } else {
                angular.element(element).find("input[type=file]").attr("multiple", "multiple");
            }
        },
        restrict: 'E',
        replace : true,
        scope: {
            selectText: '@',
            updateText : '@',
            deleteText : '@',
            mode : "@", // "multipart" or "html5"
            maxFiles : "@",
            uploadRightAway : "@",
            ngModel : "="
        },
        controller : ["$scope", "$http", "$timeout", "$upload",
            function($scope, $http, $timeout, $upload) {
                
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

        		if ($scope.maxFiles && angular.element("input[type=file]")[0].files.length > parseInt($scope.maxFiles)) {
        		    
        		}

        		if ($scope.mode == "multipart") {
        			$scope.upload[index] = $upload.upload({
        				url : baseEndPoint + '/api/file',
        				method: "POST",
        				headers: {'my-header': 'my-header-value'},
        				/*data : {
        					myModel : $scope.myModel
        				},*/
        				/* formDataAppender: function(fd, key, val) {
        					if (angular.isArray(val)) {
                                angular.forEach(val, function(v) {
                                  fd.append(key, v);
                                });
                              } else {
                                fd.append(key, val);
                              }
        				}, */
        				/* transformRequest: [function(val, h) {
        					console.log(val, h('my-header')); return val + 'aaaaa';
        				}], */
        				file: $scope.selectedFiles[index],
        				fileFormDataName: 'myFile'
        			}).then(function(response) {
        				$scope.uploadResult.push(response.data[index]);
        				$scope.ngModel = $scope.uploadResult;
        			}, null, function(evt) {
        				$scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
        			}).xhr(function(xhr){
        				xhr.upload.addEventListener('abort', function(){console.log('aborted complete')}, false);
        			});
        		} else {
        			var fileReader = new FileReader();
                    fileReader.onload = function(e) {
        		        $scope.upload[index] = $upload.http({
        		        	url: baseEndPoint + '/api/file',
        					headers: {'Content-Type': $scope.selectedFiles[index].type},
        					data: e.target.result
        				}).then(function(response) {
        					$scope.uploadResult.push(response.data[index]);
        					$scope.ngModel = response.data;
        					$scope.ngModel = $scope.uploadResult;
        				}, null, function(evt) {
        					// Math.min is to fix IE which reports 200% sometimes
        					$scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        				});
                    }
        	        fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        		}
        	}
        }],
        templateUrl: '/app/templates/common/fileUploadDirective.html'
    };
}]);
