WobenCommon.factory('errorService', function() {

    return {

        handleValidationErrors : function(data) {
            var errors;

            if (!data || !data.message) {
                return;
            }

            if (data.modelState) {
                for (var key in data.modelState) {
                    errors = data.modelState[key];
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
        }
    }
});
