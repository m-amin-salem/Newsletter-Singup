const express = require("express");
const bodyParser = require("body-parser");
// const needle = require("needle"); //HTTP -request "API Connector" - external module.
const https = require("https"); //HTTP-request "API Connector" -  native module.

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
/* Anounce this directory as root directory for all static files (images, css).
- And all files should be located inside thid directory.
- Refer to their path in the http page, without mentioning the directory name.*/

/*------------------------- Launching the server -----------------------------*/

app.listen(process.env.PORT || 3000, function() {
  console.log("The server is running on port 3000...");
});

/*------------------------- Home-page / Singup -------------------------------*/

//Route Handler:
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/singup.html");
});

app.get("/faliuer", function(req, res){
  res.redirect("/");
});

//POSTed data Handler:
app.post("/", function(req, res) {

  //userData from the singup page:
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  /*----------------------------------- API -----------------------------------*/
  //API Requirements:
  //According to the API's documentation, the userData should provided as the following:
  const userData = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }]
  };
  //Should be converted to JSON format:
  const userJsonData = JSON.stringify(userData);

  //According to the API's documentation, the path parameters should be as the following:
  const list_id = "aaf80c7709";
  const url = "https://us19.api.mailchimp.com/3.0/lists/" + list_id;

  //According to the HTTPS-request() documentation, the options should be as the following:
  const options = {
    method: "POST",
    auth: "mohammed:c10d69fcdef44b0c69cc1701d2ff4527-us19" //According to the API's documentation.
  };

  //API Connector:
  const api = https.request(url, options, function(response) {

    console.log(response.statusCode);

    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");

    } else {
      res.sendFile(__dirname + "/faliuer.html");
    };

    //API's provided data handler:
    response.on("data", function(d) {
      //convert the provided JSON to object:
      const apiJsonData = JSON.parse(d);

      // console.log(apiJsonData);
    });

  });

  //API connection error handler:
  api.on("error", function(e) {
    console.error(e);
  });

  //Send data to API:
  api.write(userJsonData);

  //End the connection:
  api.end();
});
/*------------------------------- API End -----------------------------------*/






/*------------------------------- API -----------------------------------
The used API is mailchimp.com
Sending emails (Newsletter) to my contacts list.

https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/
https://mailchimp.com/developer/reference/
https://mailchimp.com/developer/reference/lists/


Documentation:

A - Lists/Audiences:
 Your Mailchimp list, also known as your audience, is where you store and
 manage all of your contacts.

 https://mailchimp.com/developer/reference/lists/#post_/lists/-list_id-

 Batch sub/unsub list members:

  *-Request Path Parameters: (will be used in the URL).
    list_id
    (can be found in: Mailchimp.com-->Audiences\manage udiences\settings\Unique id for audiences list).
    My list id:
    aaf80c7709

    example:
    --url "https://usx.api.mailchimp.com/3.0/lists/{list_id}";
    "usx"should be changed according to my "API key".

  *-Request Body Parameters: (will be used to create the data will be sent to the API's server).
    members = [
    email_address: "userEmail",
    status: Possible Values: "subscribed, unsubscribed, cleaned, pending, transactional",
    merge_fields: {FNAME: "userName", LNAME: "userName"}
    ]


B - HTTP Basic Authentication:
 To authenticate a request using an API key, follow these steps:

  1- Enter any string as the username.
  2- Enter your API Key as the password.

  example:
  --user 'anystring:<your_apikey>'

  My API key: (will be used in options{auth}).
  c10d69fcdef44b0c69cc1701d2ff4527-us19
-------------------------------------------------------------------------*/
