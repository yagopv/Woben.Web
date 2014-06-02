var WobenCommon = angular.module('WobenCommon',['ui.router', 'angularFileUpload']);

WobenCommon.value("baseEndPoint", "https://woben.azurewebsites.net");

WobenCommon.directive('woCheckbox', function() {
    return {
        link : function(scope, element, attrs) {
            var $checkbox = $(element).find('[data-toggle=checkbox]');
            $checkbox.checkbox();

            if (scope.value == "true") {
                scope.ngModel = true;
                $checkbox.checkbox("check");
            } else {
                scope.ngModel = false;
                $checkbox.checkbox("uncheck");
            }

            $(element).on("click", function() {
                scope.ngModel = !($checkbox.is(":checked"));
                if (scope.ngModel == true) {
                    $checkbox.checkbox("check");
                } else {
                    $checkbox.checkbox("uncheck");
                }
                scope.$apply();
                return false;
            });

            attrs.$observe('value', function(newValue) {
                if (newValue == "true") {
                    $checkbox.checkbox("check");
                } else {
                    $checkbox.checkbox("uncheck");
                }
            });
        },
        restrict: 'E',
        replace : true,
        scope: {
            label: '@',
            value : '@',
            ngModel : "="
        },
        controller : function() {

        },
        templateUrl: '/app/templates/common/checkboxDirective.html'
    };
});
WobenCommon.directive('woRadio', function() {
    return {
        link : function(scope, element, attrs) {
            var $radio = $(element).find(':radio');
            $radio.radio();
            
            $(':radio').on('toggle', function(event) {
                scope.ngModel = $(event.target).val();
            });
        },
        scope : {
            ngModel : "="
        },
        restrict: 'EAC'
    };
});
WobenCommon.directive('woErrors', function() {
    return {
        restrict: 'E',
        replace : true,
        scope: {
            errors : "=",
            title : "@"
        },
        templateUrl: '/app/templates/common/errorDirective.html'
    };
});
WobenCommon.factory('authInterceptor', ["$rootScope", "$q", "$window", 

function ($rootScope, $q, $window) {
        
        return {
            request: function (config) {
                config.headers = config.headers || {};
                var token = $window.sessionStorage.token;
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    console.log(response);
                }
                return response || $q.when(response);
            }
        };
}]);
WobenCommon.factory('oDataInterceptor', ["$q", 

function ($q) {
    
    var camelcaseObject = function(data) {
        var oDataObject = {};
        
        for (prop in data) {
            var propCamelCased = prop.charAt(0).toLowerCase() + prop.slice(1);
            if (angular.isArray(data[prop])) {
                oDataObject[propCamelCased] =  [];
                angular.forEach(data[prop], function(item, index) {
                    var relatedoDataObject = { };
                    for (subprop in item) {
                        var subpropCamelCased = subprop.charAt(0).toLowerCase() + subprop.slice(1);
                        relatedoDataObject[subpropCamelCased] = item[subprop];
                    }
                    oDataObject[propCamelCased].push(relatedoDataObject);
                });
            } else {
                if (angular.isObject(data[prop])) {
                    oDataObject[propCamelCased] = camelcaseObject(data[prop]);
                } else {
                    oDataObject[propCamelCased] = data[prop];
                }
            }
        }     
        
        return oDataObject;
    };
    
    var examineODataResponse = function(data) {
        
        if (data["odata.metadata"].indexOf("$metadata#Category") != -1 ||
            data["odata.metadata"].indexOf("$metadata#Product") != -1  ||
            data["odata.metadata"].indexOf("$metadata#Notification") != -1 ||
            data["odata.metadata"].indexOf("$metadata#Message") != -1) {

            if (data.value) {
                oDataArray = [];
                angular.forEach(data.value, function(item, index) {
                    oDataArray.push(camelcaseObject(item));
                });
                return oDataArray;
            } else {
                return camelcaseObject(data);
            }
        }

        return response;
    };;

    return {
        response: function (response) {
            // do something on success
            if(response.headers()['content-type'] === "application/json; charset=utf-8") {
                // Validate response if not ok reject
                var oDataObject = null;
                
                if (response.data["odata.metadata"]) {
                    var oDataObject = examineODataResponse(response.data);
                }

                if(oDataObject) {
                    response.data =  oDataObject;
                }
            }
            return response;
        },
        responseError: function (response) {
            // do something on error
            return $q.reject(response);
        }
    };
}]);

WobenCommon.factory('errorService', function() {

    return {

        handleValidationErrors : function(data) {
            var errors = [];

            if (!data || !data.message) {
                return;
            }

            if (data.modelState) {
                for (var key in data.modelState) {
                    errors.push(data.modelState[key][0]);
                }
            }

            return {
                message : data.message,
                errors  : errors
            }
        },

        handleAuthenticationErrors : function(data) {
           return {
               message : data.error,
               errors : new Array(data.error_description)
           }
        },
        
        handleODataErrors : function(data) {
            var odataError = data["odata.error"],
                errors = [];
                
            if (!odataError) {
                return
            }
            
            if (odataError.innererror) {
                var arrayErrors = odataError.innererror.message.split(".");
                for (var i = 0; i < arrayErrors.length; i++) {
                    if (arrayErrors[i].indexOf(":") != -1) {
                        errors.push(arrayErrors[i].split(":")[1]);
                    } else {
                        errors.push(arrayErrors[i]);
                    }
                }
            }
            
            return {
                 message : odataError.message.value,
                 errors : errors
            }
        }
    }
});

WobenCommon.directive('woOffcanvas', ["$window", 

function($window) {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        scope :  {
          activeTransitions : "@",
          noAdditional : "@",
          noMenu : "@"
        },
        controller : ["$scope", function($scope) {
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
        }],
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
}]);

WobenCommon.directive('woOffcanvasMenu', function() {
    return {
        restrict: 'E',
        replace : true,
        require : "^woOffcanvas",
        transclude : true,
        template: '<div class="st-offcanvas-menu" ng-transclude></div>',
        link : function($scope, element, attrs, offcanvas) {
            $(element).on("click", function() {
                offcanvas.toggleMenu();
            });
        }
    };
});

WobenCommon.directive('woOffcanvasMain', ["$window", function($window) {
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
        controller : ["$scope", function($scope) {
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
            };

            var calculateMinHeight = function() {
                var menuHeight =  angular.element(".st-offcanvas-menu").height(),
                    minHeight = angular.element(window).height() -
                    angular.element("footer").height();
                    if (minHeight < menuHeight) {
                        minHeight = menuHeight + 20;
                    }
                    angular.element(".st-offcanvas-main").css("min-height", minHeight);
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

            $scope.$on("woben:loaderhide", function() {
                calculateMinHeight();                                
            });            
            checkButtonsVisibility();
        }],
        link: function($scope, element, attrs, offcanvas) {
            $scope.toggleMenu = offcanvas.toggleMenu;
            $scope.toggleAdditional = offcanvas.toggleAdditional;
        }
    };
}]);

WobenCommon.directive('woOffcanvasAdditional', function() {
    return {
        restrict: 'E',
        replace : true,
        transclude : true,
        require: '^woOffcanvas',
        template: '<div  class="st-offcanvas-additional" ng-transclude></div>'
    };
});

WobenCommon.factory('utilsService', function() {

    return {
        groupToPages : function(collection, itemsPerPage) {
            var pagedItems = [];

            for (var i = 0; i < collection.length; i++) {
                if (i % itemsPerPage === 0) {
                    pagedItems[Math.floor(i / itemsPerPage)] = [ collection[i] ];
                } else {
                    pagedItems[Math.floor(i / itemsPerPage)].push(collection[i]);
                }
            }

            return pagedItems;
        },

        addDummyProduct : function(products) {
            var len = products.length;
            if ((len % 3) == 2) {
                products.push({
                   categoryId : Number.MAX_VALUE,
                   dummy : true
                });
            }
        }
    }
});

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

WobenCommon.directive("woLoader", ["$rootScope", 

function ($rootScope) {
    
        return {
            link : function($scope, element, attrs) {
                $scope.$on("woben:loadershow", function () {
                    return element.show();
                });
                return $scope.$on("woben:loaderhide", function () {
                    return element.hide();
                });
            },
            restrict: 'E',
            replace : true,
            templateUrl: '/app/templates/common/loaderDirective.html'
        };
    }
]);
WobenCommon.factory('loaderInterceptor', ["$q", "$rootScope", "$log", 

function ($q, $rootScope, $log) {

    var numLoadings = 0;

    return {
        request: function (config) {

            numLoadings++;

            // Show loader
            $rootScope.$broadcast("woben:loadershow");
            return config || $q.when(config)

        },
        response: function (response) {

            if ((--numLoadings) === 0) {
                // Hide loader
                $rootScope.$broadcast("woben:loaderhide");
            }

            return response || $q.when(response);

        },
        responseError: function (response) {

            if (!(--numLoadings)) {
                // Hide loader
                $rootScope.$broadcast("woben:loaderhide");
            }

            return $q.reject(response);
        }
    };
}]);

WobenCommon.directive('woSelect', function() {
    return {
        link : function(scope, element, attrs) {
            angular.element(element).selectpicker({style: 'btn-primary', menuStyle: 'dropdown-inverse'});
        },
        restrict: 'E',
        replace : true,
        scope: {
            title : "@",            
            value : "@",
            description : "@",
            options : "=",
            ngModel : "="
        },
        templateUrl: '/app/templates/common/selectDirective.html'
    };
});
WobenCommon.directive("woTypeahead", function () {
    return {
      restrict: 'AC',       // Only apply on an attribute or class
      require: '?ngModel',  // The two-way data bound value that is returned by the directive
      scope: {
        options: '=',       // The typeahead configuration options (https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#options)
        datasets: '='       // The typeahead datasets to use (https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#datasets)
      },
      link: function (scope, element, attrs, ngModel) {

        var options = scope.options || {},
            datasets = (angular.isArray(scope.datasets) ? scope.datasets : [scope.datasets]) || []; // normalize to array

        // Create the typeahead on the element
        element.typeahead(scope.options, scope.datasets);

        // Parses and validates what is going to be set to model (called when: ngModel.$setViewValue(value))
        ngModel.$parsers.push(function (fromView) {
          // Assuming that all objects are datums
          // See typeahead basics: https://gist.github.com/jharding/9458744#file-the-basics-js-L15
          var isDatum = angular.isObject(fromView);
          if (options.editable === false) {
            ngModel.$setValidity('typeahead', isDatum);
            return isDatum ? fromView : undefined;
          }

          return fromView;
        });

        // Formats what is going to be displayed (called when: $scope.model = { object })
        ngModel.$formatters.push(function (fromModel) {
          if (angular.isObject(fromModel)) {
            var found = false;
            $.each(datasets, function (index, dataset) {
              var query = dataset.source,
                  displayKey = dataset.displayKey || 'value',
                  value = (angular.isFunction(displayKey) ? displayKey(fromModel) : fromModel[displayKey]) || '';

              if (found) return false; // break

              if (!value) {
                // Fakes a request just to use the same function logic
                search([]);
                return;
              }

              // Get suggestions by asynchronous request and updates the view
              query(value, search);
              return;

              function search(suggestions) {
                var exists = inArray(suggestions, fromModel);
                if (exists) {
                  ngModel.$setViewValue(fromModel);
                  found = true;
                } else {
                  ngModel.$setViewValue(options.editable === false ? undefined : fromModel);
                }

                // At this point, digest could be running (local, prefetch) or could not be (remote)
                // As bloodhound object is inaccessible to know that, simulates an async to not conflict
                // with possible running digest
                if (found || index === datasets.length - 1) {
                  setTimeout(function () {
                    scope.$apply(function () {
                      element.typeahead('val', value);
                    });
                  }, 0);
                }
              }
            });

            return ''; // loading
          }
          return fromModel;
        });

        function inArray(array, element) {
          var found = -1;
          angular.forEach(array, function (value, key) {
            if (angular.equals(element, value)) {
              found = key;
            }
          });
          return found >= 0;
        }

        function getCursorPosition (element) {
          var position = 0;
          element = element[0];

          // IE Support.
          if (document.selection) {
            var range = document.selection.createRange();
            range.moveStart('character', -element.value.length);

            position = range.text.length;
          }
          // Other browsers.
          else if (typeof element.selectionStart === 'number') {
            position = element.selectionStart;
          }
          return position;
        }

        function setCursorPosition (element, position) {
          element = element[0];
          if (document.selection) {
            var range = element.createTextRange();
            range.move('character', position);
            range.select();
          }
          else if (typeof element.selectionStart === 'number') {
            element.focus();
            element.setSelectionRange(position, position);
          }
        }

        function updateScope (object, suggestion, dataset) {
          scope.$apply(function () {
            ngModel.$setViewValue(suggestion);
          });
        }

        // Update the value binding when a value is manually selected from the dropdown.
        element.bind('typeahead:selected', function(object, suggestion, dataset) {
          updateScope(object, suggestion, dataset);
          scope.$emit('typeahead:selected', suggestion, dataset);
        });

        // Update the value binding when a query is autocompleted.
        element.bind('typeahead:autocompleted', function(object, suggestion, dataset) {
          updateScope(object, suggestion, dataset);
          scope.$emit('typeahead:autocompleted', suggestion, dataset);
        });

        // Propagate the opened event
        element.bind('typeahead:opened', function() {
          scope.$emit('typeahead:opened');
        });

        // Propagate the closed event
        element.bind('typeahead:closed', function() {
          scope.$emit('typeahead:closed');
        });

        // Propagate the cursorchanged event
        element.bind('typeahead:cursorchanged', function(event, suggestion, dataset) {
          scope.$emit('typeahead:cursorchanged', event, suggestion, dataset);
        });

        // Update the value binding when the user manually enters some text
        // See: http://stackoverflow.com/questions/17384218/jquery-input-event
        element.bind('input', function () {
          var preservePos = getCursorPosition(element);
          scope.$apply(function () {
            var value = element.typeahead('val');
            ngModel.$setViewValue(value);
          });
          setCursorPosition(element, preservePos);
        });
      }
    };
  });