class ApiError extends Error {
    constructor(
        statusCode,
        message = "Somethinf went wrong, please contact with the administrator!!!",
        errors = [],
        stack =""
    ){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = null;
        this.success = false;
        this.message = message;

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError};