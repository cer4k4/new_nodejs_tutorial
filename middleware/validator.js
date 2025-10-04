const Joi = require('joi')

async function requestValidator(schemaName,request)
{
    if (schemaName === 'limit'){
        const UserSchema = Joi.object({
        limit: Joi.number().required().default(10),}).options({ abortEarly: false });
        return UserSchema.validate({limit:request})        
    }
    if (schemaName === 'page'){
        const UserSchema = Joi.object({
        page: Joi.number().required().default(1),
        }).options({ abortEarly: false });
        return UserSchema.validate({page:request})        
    }
    if (schemaName === 'registerUser') {
        const UserSchema = Joi.object({
            username: Joi.string()
                      .min(5)
                      .max(30)
                      .required(),
            fullName: Joi.string()
                      .min(3)
                      .max(90),
            password: Joi.string()
                      .min(6)
                      .max(20)
                      .required(),

        }).options({ abortEarly: false });
        return UserSchema.validate(request)
    }
    
    if (schemaName === 'loginUser') {
        const UserSchema = Joi.object({
            username: Joi.string()
            .min(5)
            .max(30)
            .required(),
            password: Joi.string()
            .max(20)
            .required(),
        }).options({ abortEarly: false });
        return UserSchema.validate(request)
    }

    if (schemaName === 'getById') {
        const UserSchema = Joi.object({
        id: Joi.string()
        .required(),
        }).options({ abortEarly: false });
        return UserSchema.validate({id:request})
    }
}



module.exports = { requestValidator }