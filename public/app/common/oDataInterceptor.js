WobenCommon.factory('oDataInterceptor', function ($q) {
    
    var camelcaseObject = function(data) {
        var oDataObject = {};
        
        for (prop in data) {
            var propCamelCased = prop.charAt(0).toLowerCase() + prop.slice(1);
            oDataObject[propCamelCased] = data[prop];
        }     
        
        return oDataObject;
    }
    
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
    }

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
