const asyncMethodHandler = (requestMethod) => {
    return (req,res, next) => {
        Promise.resolve(requestMethod(req,res, next)).catch((err)=> next(err));
    }
}

export {asyncMethodHandler};