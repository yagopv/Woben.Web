WobenCommon.factory('oDataInterceptor', function ($q) {
    
    var camelcaseObject = function(data, toUpper) {
        var oDataObject = {};
        
        for (prop in data) {
            var propCamelCased = toUpper ?  prop.charAt(0).toUpperCase() + prop.slice(1) : prop.charAt(0).toLowerCase() + prop.slice(1);
            if (angular.isArray(data[prop])) {
                oDataObject[propCamelCased] =  [];
                angular.forEach(data[prop], function(item, index) {
                    var relatedoDataObject = { };
                    for (subprop in item) {
                        var subpropCamelCased = toUpper ?  subprop.charAt(0).toUpperCase() + subprop.slice(1) : subprop.charAt(0).toLowerCase() + subprop.slice(1);
                        relatedoDataObject[subpropCamelCased] = item[subprop];
                    }
                    oDataObject[propCamelCased].push(relatedoDataObject);
                });
            } else {
                oDataObject[propCamelCased] = data[prop];
            }
        }     
        
        return oDataObject;
    };
    
    var examineODataResponse = function(data) {
        
        if (data["odata.metadata"].indexOf("$metadata#Category") != -1 || data["odata.metadata"].indexOf("$metadata#Product") != -1) {
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
    };

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
});
