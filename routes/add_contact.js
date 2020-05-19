//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool


var router = express.Router()

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

/**
 * @api {post} /add_user adds two contacts together
 * @apiName GetContacts
 * @apiGroup Contacts
 * 
 * @apiParam {String} MemberID_A first person's id
 * @apiParam {String} MemberID_B second person's id
 * 
 * @apiSuccess (Success 201) {boolean} success true when the MemberId is inserted
 * @apiSuccess (Success 201) {String} message the inserted MemberId
 * 
 * @apiError (400: Name exists) {String} message "Friend Already Exists"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.post("/", (request, response) => {

    if (request.body.MemberID_A && request.body.MemberID_B) {
        const theQueryCheck = "SELECT * FROM Contacts WHERE MemberID_A = $1 AND MemberID_B = $2"


        const theQuery = "INSERT INTO Contacts(MemberID_A, MemberID_B) VALUES ($1, $2)"
        const values = [request.body.MemberID_A, request.body.MemberID_B]

        pool.query(theQueryCheck, values)
            .then(result => {
                if (result.rowCount == 0) {
                    pool.query(theQuery, values)
                    .then(result => {
                    response.status(201).send({
                    success: true,
                    message: "Hey: " + result.rows[0]
                })
            })
            .catch(err => {
                //log the error
                console.log(err)
                    response.status(400).send({
                        message: err.detail
                    })
            }) 
                } else {
                    response.status(400).send({
                        success: true,
                        message: "Friend Already Exists"
                    })
                }
                
            })
            .catch(err => {
                //log the error
                console.log(err)
                
                    response.status(400).send({
                        message: err.detail
                    })
                
            })

        
            
    } else {
        response.status(400).send({
            message: "Missing required information!"
        })
    }    
})

module.exports = router