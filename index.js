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
app.get("/", (req, res) => {
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
            res.redirect("/")
            console.log("nice")
        } else {
            res.redirect("/")
            console.log("darn")
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    // knex
    //     .select()
    //     .from("User")
    //     // .where("col1", filterValue) // Use This to filter the results
    //     .then(queryResult => {
    //         // Pass Results to Dictionary
    //         let data = {
    //             records: queryResult
    //         }
    //         console.log(data)
    //         //Pass Data to View, Render and Return to User
    //         res.redirect("/")
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({err});
    //     });
    
})

// Render Login Page
app.get("/login")

// Activate Listener
app.listen(port, () => console.log("Listening Active, Server Operational"));
console.log("Starting development server at http://localhost:" + port)