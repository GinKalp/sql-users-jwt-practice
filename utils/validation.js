const Joi = require('joi')


// validate
async function validateRegister(req, res, next){
    const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    })
    try {
        const value = await schema.validateAsync(req.body,{abortEarly: false})
        next()
    } catch (err){
        console.log(err.message)
        return res.status(400).send({error: err.details.map(item => ({
                errorMsg: item.message,
                field: item.context.key
            }))})
    }
}
async function validatePost(req, res, next){
    const schema = Joi.object({
        title: Joi.string().min(3).max(20).required(),
        body: Joi.string().min(6).max(200).required(),
        image: Joi.string().min(6).required()
    })
    try {
        const value = await schema.validateAsync(req.body,{abortEarly: false})
        next()
    } catch (err){
        console.log(err.message)
        return res.status(400).send({error: err.details.map(item => ({
                errorMsg: item.message,
                field: item.context.key
            }))})
    }
}
module.exports = {
    validateRegister,
    validatePost
}