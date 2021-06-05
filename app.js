//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");


const app = express();

app.use(express.static("public")); //indica o caminho onde se deve manter a pagina estatica

app.use(bodyParser.urlencoded({extended:true}));

client.setConfig({apiKey: "fb21a18a087ef228c997d56b334c347f-us6",  server: "us6",});

app.get("/", function(req,res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    

    const subscribingUser = {
        firstName: firstName, 
        lastName: lastName, 
        email: email
    }

    const run = async () => {
        const response = await client.lists.addListMember("a0b7614d86", {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
          }
        }) .then(responses => {
            if(responses.id !== "") {
                res.sendFile(__dirname + "/success.html");
            }
        }) .catch(err => {
            res.sendFile(__dirname + "/failure.html");
            console.log(err);
        })
        
        console.log(response); // (optional) 
        
      };
      run();
    
});

app.post("/failure", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})



app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});

//API Key
//fb21a18a087ef228c997d56b334c347f-us6

//List Id
//a0b7614d86