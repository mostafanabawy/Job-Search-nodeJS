import joi from 'joi'
export function validate(schema) {
    return (req, res, next) => {
        const data = {...req.params, ...req.body, ...req.query}
        //in case of files from multer
        if(req.files?.length || req.file){
            data.file = req.file || req.files
        }
        const { error } = schema.validate(data, {abortEarly: false});
        if (error) {
            return next(error);
        }
        next();
    }   
}