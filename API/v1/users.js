const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const {validateRegister} = require("../../utils/validation");
const {hashValue} = require("../../utils/hashHelper");
const {dbGetAction, dbFail, dbSuccess} = require("../../utils/requestHelper");

router.post('/register', async (req, res) =>{
    const { email, password } = req.body
    // validate
    const validateResult = await validateRegister(res, req.body)
    if (!validateResult) return

    const sql = `INSERT INTO users(email, password)
                     VALUES(?, ?)`
    const hashedPass = hashValue(password)

    const registerData = await dbGetAction(sql, [email, hashedPass])
    if (!registerData.isSuccess) return dbFail(res, registerData.error)

    dbSuccess(res, "User registered.")
})

module.exports = router
