//express is the framework we're going to use to handle requests
const express = require('express')
//Create a new instance of express
const app = express()

let middleware = require('./utilities/middleware')

const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json())

app.use('/auth', require('./routes/login.js')) 
app.use('/auth', require('./routes/register.js')) 
app.use('/lookup_user', require('./routes/lookup_user.js')) 
app.use('/weather', require('./routes/weather.js'))
app.use('/add_user', require('./routes/add_contact.js'))
app.use('/fetch_contact', require('./routes/fetch_contacts.js'))
app.use('/accept_contact', require('./routes/accept_contact.js'))
app.use('/fetch_contact_pending', require('./routes/fetch_contacts_pending.js'))
app.use('/delete_contact', require('./routes/deleteContacts.js'))
app.use('/messages', middleware.checkToken, require('./routes/messages.js'))
app.use('/chats', middleware.checkToken, require('./routes/chats.js'))
app.use('/auth', middleware.checkToken, require('./routes/pushyregister.js'))
app.use('/favorites', require('./routes/favoriteLocations.js'))



app.get("/wait", (request, response) => {
  setTimeout(() => {
  response.send({
  message: "Thanks for waiting"
  });
  }, 5000)
 }) 

/*
 * This middleware function will respond to inproperly formed JSON in 
 * request parameters.
 */
app.use(function(err, req, res, next) {

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400).send({ message: "malformed JSON in parameters" });
  } else next();
})

/*
 * Return HTML for the / end point. 
 * This is a nice location to document your web service API
 * Create a web page in HTML/CSS and have this end point return it. 
 * Look up the node module 'fs' ex: require('fs');
 */
app.get("/", (request, response) => {
    //this is a Web page so set the content-type to HTML
    response.writeHead(200, {'Content-Type': 'text/html'});
        //write a response to the client
        response.write('<h' + 1 + ' style="color:blue">Hello, welcome to our group project app! To view documentation please go to <br> https://team4-tcss450-project-server.herokuapp.com/doc/</h' + 1 + '>'); 
    response.end(); //end the response
});

/*
 * Serve the API documentation genertated by apidoc as HTML. 
 * https://apidocjs.com/
 */
 app.use("/doc", express.static('apidoc'))

/* 
* Heroku will assign a port you can use via the 'PORT' environment variable
* To accesss an environment variable, use process.env.<ENV>
* If there isn't an environment variable, process.env.PORT will be null (or undefined)
* If a value is 'falsy', i.e. null or undefined, javascript will evaluate the rest of the 'or'
* In this case, we assign the port to be 5000 if the PORT variable isn't set
* You can consider 'let port = process.env.PORT || 5000' to be equivalent to:
* let port; = process.env.PORT;
* if(port == null) {port = 5000} 
*/ 
app.listen(process.env.PORT || 5000, () => {
    console.log("Server up and running on port: " + (process.env.PORT || 5000));
});


