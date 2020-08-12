const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const keys = require("./keys.js");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("", (req, res) => {
    console.log(req.body)
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    console.log(keys.mailChimpId);
    console.log(keys.mailChimpKey)

    const url = `https://us17.api.mailchimp.com/3.0/lists/${keys.mailChimpId}`;

    const options = {
        method: "POST",
        auth: `tmnguyen8${keys.mailChimpKey}`
    }

    // Making HTTPS REQUEST
    const request = https.request(url, options, (response) => {
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data))
        })
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen( port, ()=> console.log(`Server is running on port ${port}.`));
