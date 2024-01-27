// Describe your app here
// Add your name

// Configure environment Variables:
require("dotenv").config();


// Extract Environment Variables
const ENV_VARIABLES = {
    dbHost: process.env.DATABASE_HOST,
    dbUser: process.env.DATABASE_USER,
    dbPassword: process.env.DATABASE_PASSWORD,
    dbName: process.env.DATABASE_NAME,
    dbPort: process.env.DB_PORT,
    appPort: parseInt(process.env.PORT)
};

// Define Knex Database Connection
const knex = require("knex")({
    client: "mysql",   //Alternatively  for postgres use: client: "pg",
    connection: {
        host : ENV_VARIABLES.dbHost,
        user : ENV_VARIABLES.dbUser,
        password : ENV_VARIABLES.dbPassword,
        database : ENV_VARIABLES.dbName,
        port: ENV_VARIABLES.dbPort
    }
});

// Define Constants:
const path = require("path");
const port = ENV_VARIABLES.appPort;

// Define + Configure Express:
let express = require('express');
let app = express();

const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
// const { peerProxy } = require("./peerProxy.js");
const authCookieName = "token";
app.use(express.json());
app.use(cookieParser());

// Define Static File Directory
app.use(express.static("public"))

// Setup Form Access
app.use(express.urlencoded({extended: true}));

// Define EJS Engine/Location
app.set("view engine", "ejs");

console.log("Server Started");

// Define Routes:
// Root Directory
app.get("/", checkAuth, (req, res) => {
    res.render("index");
})
app.get("/login", (req, res) => {
    res.render("login");
});

//Authenticate User
app.post("/login", async (req, res) => {
    let inputData = {
        "email": req.body.email,
        "password": req.body.password
    }
    // Pull User from Database
    try {
        const user = await knex("User").where("email", inputData.email).first();
        if (inputData.password === user.password) {
            setAuthCookie(res, user.userId);
            console.log(user);
            res.redirect("/");
        } else {
            res.redirect("/login");
        }
    } catch (error) {
        console.error(error);
        res.redirect("/login");
      }
});

// Create New User
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Activate Listener
app.listen(port, () => console.log("Listening Active, Server Operational"));
console.log("Starting development server at http://localhost:" + port)


// Functions
// function setAuthCookie(res, userId) {
//     // Set the authentication cookie with the user ID
//     res.cookie(authCookieName, userId, {
//         maxAge: 86400000, // Cookie expiration time in milliseconds (1 day in this example)
//         httpOnly: true,   // Cookie accessible only through HTTP(S) requests
//         // You may want to add other cookie options like secure, sameSite, etc. based on your requirements
//     });
// }
function setAuthCookie(res, userId) {
    res.cookie(authCookieName, userId, {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    });
  }

  function checkAuth(req, res, next) {
    const userId = req.cookies[authCookieName];

    if (userId) {
        req.userId = userId;
        next();
    } else {
        // Redirect to the login page or perform other actions for unauthenticated users
        res.redirect("/login");
    }
}