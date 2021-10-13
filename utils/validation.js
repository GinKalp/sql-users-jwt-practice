const Joi = require('joi')


// validate
async function validateRegister(res, registerBody){
    const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    })
    try {
        const value = await schema.validateAsync(registerBody,{abortEarly: false})
        return true
    } catch (err){
        console.log(err.message)
        res.status(400).send({error: err.details.map(item => ({
                errorMsg: item.message,
                field: item.context.key
            }))})
        return false
    }
}

module.exports = {
    validateRegister
}