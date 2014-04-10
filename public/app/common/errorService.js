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
