const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const {validateRegister} = require("../../utils/validation");
const {hashValue} = require("../../utils/hashHelper");
const {dbGetAction, dbFail, dbSuccess} = require("../../utils/requestHelper");
const {verifyHash} = require("../../utils/hashHelper");
const jwtAuth = require("../../utils/jwtHelper")

router.post('/register', validateRegister, async (req, res) =>{
    const { email, password } = req.body

    const sql = `INSERT INTO users(email, password)
                     VALUES(?, ?)`
    const hashedPass = hashValue(password)

    const registerData = await dbGetAction(sql, [email, hashedPass])
    if (!registerData.isSuccess) return dbFail(res, registerData.error)

    dbSuccess(res, "User registered.")
})
router.post('/login', async (req, res) =>{
    const { email, password } = req.body
    // check if we have a user email in our table
    const sql = `SELECT * FROM users WHERE email = ?`
    const data = await dbGetAction(sql,  [email])
    console.log(data)
    if (!data.isSuccess) return dbFail(res, data.error)
    if (!data.result) return dbFail(res, "User not found.", 400)
    if (!verifyHash(password, data.result.password)){

        return dbFail(res, "Passwords don't match.", 400)
    }
    const userToBeEncrypted = {
        email: data.result.email,
        userId: data.result.userid
    }
    const token = jwt.sign(userToBeEncrypted, process.env.ACCESS_TOKEN_SECRET)
    dbSuccess(res, `User logged in`, {email: userToBeEncrypted.email, userId: userToBeEncrypted.userId, token})
})

module.exports = router
