//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool


var router = express.Router()

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

/**
 * @api {post} /addContact adds two contacts together
 * @apiName GetContacts
 * @apiGroup Contacts
 * 
 * @apiParam {String} MemberID_A first person's id
 * @apiParam {String} MemberID_B second person's id
 * 
 * @apiSuccess (Success 201) {boolean} success true when the MemberId is inserted
 * @apiSuccess (Success 201) {String} message the inserted MemberId
 * 
 * @apiError (400: Name exists) {String} message "Already friends"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.post("/", (request, response) => {

    if (request.body.MemberID_A == request.body.MemberID_B) {
        response.status(400).send({
            message: "You cannot be friends with yourself..."
        })
    } else {

    if (request.body.MemberID_A && request.body.MemberID_B) {
        const theQuery = "INSERT INTO Contacts(MemberID_A, MemberID_B) VALUES ($1, $2)"
        const values = [request.body.MemberID_A, request.body.MemberID_B]

        pool.query(theQuery, values)
            .then(result => {
                response.status(201).send({
                    success: true,
                    message: "Inserted: " + result.rows[0]
                })
            })
            .catch(err => {
                //log the error
                console.log(err)
                if (err.constraint == "demo_name_key") {
                    response.status(400).send({
                        message: "Name exists"
                    })
                } else {
                    response.status(400).send({
                        message: err.detail
                    })
                }
            }) 
            
    } else {
        response.status(400).send({
            message: "Missing required information!"
        })
    }
}    
})

module.exports = router