const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mysql = require('mysql2/promise');
const {dbConfig} = require('../../src/config');
const {validatePost} = require("../../utils/validation");
const {hashValue} = require("../../utils/hashHelper");
const {dbGetAction, dbFail, dbSuccess} = require("../../utils/requestHelper");
const {verifyHash} = require("../../utils/hashHelper");
const jwtAuth = require("../../utils/jwtHelper")

// POST /posts/new - create new post
router.post('/new', validatePost, jwtAuth, async (req, res) =>{
    const { title, body, image } = req.body
    const userId  = req.userId
    // Validation
    console.log(req.body, userId)
    const sql = `INSERT INTO posts (title, body, image, userid)
                   VALUES(?, ?, ?, ?)`
    const dbData = await dbGetAction(sql, [...Object.values(req.body), userId])

    if (!dbData.isSuccess) return dbFail(res, 'Something went wrong')
    if (!dbData.result) return dbFail(res, 'Incorrect data given.', 400)

    dbSuccess(res, "Post added", dbData.result)
})
// GET /posts/all - list all post from everyone
router.get('/all',  async (req, res) =>{
    const sql = `SELECT u.email, p.title, p.body, p.image, p.timeStamp FROM posts as p
                     LEFT JOIN users as u
                     ON p.userid = u.userid`
    const dbData = await dbGetAction(sql)

    if (!dbData.isSuccess) return dbFail(res, 'Something went wrong')
    if (!dbData.result) return dbFail(res, 'Incorrect data given.', 400)

    dbSuccess(res, "Got posts", dbData.result)
})
// DELETE /posts/:id - delete post with postId === :id, Validate with jwt
router.delete('/:id', jwtAuth, async (req, res) =>{
    const { id } = req.params
    const userId = req.userId
    const sqlAuth = `SELECT * FROM posts
                    LEFT JOIN users
                    ON posts.userid = users.userid
                    WHERE posts.postid = ?`
    const dbAuthData = await dbGetAction(sqlAuth, [id])
    console.log(dbAuthData)
    if (!dbAuthData.isSuccess) return dbFail(res, 'Something went wrong')
    if (!dbAuthData.result) return dbFail(res, 'Post not found.', 400)
    if (dbAuthData.result.userid !== userId) return dbFail(res, 'Unauthorized', 401)
    const sql = `DELETE FROM posts
                     WHERE postid = ?`
    const dbData = await dbGetAction(sql, [id])

    if (!dbData.isSuccess) return dbFail(res, 'Something went wrong')
    if (!dbData.result) return dbFail(res, 'Incorrect data given.', 400)
    dbSuccess(res, "Post deleted", dbData.result)
})
module.exports = router;
