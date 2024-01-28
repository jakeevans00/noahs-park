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
  appPort: parseInt(process.env.PORT),
  api_key: process.env.API_KEY,
};

// Define Knex Database Connection
const knex = require("knex")({
  client: "mysql", //Alternatively  for postgres use: client: "pg",
  connection: {
    host: ENV_VARIABLES.dbHost,
    user: ENV_VARIABLES.dbUser,
    password: ENV_VARIABLES.dbPassword,
    database: ENV_VARIABLES.dbName,
    port: ENV_VARIABLES.dbPort,
  },
});

// Define Constants:
const path = require("path");
const port = ENV_VARIABLES.appPort;

// Define + Configure Express:
let express = require("express");
let app = express();

const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const { peerLink } = require("./peerLink.js");
const authCookieName = "token";
app.use(express.json());
app.use(cookieParser());

// Define Static File Directory
app.use(express.static("public"));

// Setup Form Access
app.use(express.urlencoded({ extended: true }));

// Define EJS Engine/Location
app.set("view engine", "ejs");

console.log("Server Started");

// Define Routes:
// Root Directory
app.get("/", checkAuth, (req, res) => {
  const userId = req.cookies[authCookieName];
  knex("User")
    .where("id", userId)
    .first()
    .then((data) => {
      data["API_KEY"] = ENV_VARIABLES.api_key;
      console.log(data);
      res.render("index", { data });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
      // res.status(500).json(err);
    });
});
app.get("/login", (req, res) => {
  res.render("login");
});

//Authenticate User
app.post("/login", async (req, res) => {
  const inputData = {
    email: req.body.email,
    password: req.body.password,
  };
  // Pull User from Database
  try {
    const user = await knex("User").where("email", inputData.email).first();
    console.log(user)
    if (inputData.password === user.password) {
      setAuthCookie(res, user.id);
      console.log(user);
      res.redirect("/");
    } else {
        console.log("auth fail")
      res.redirect("/login");
    }
  } catch (error) {
    console.log("auth fail")
    console.error(error);
    res.redirect("/login");
  }
});

// Create New User
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  const inputs = {
    email: req.body.email,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    car_make: req.body.car_make,
    car_model: req.body.car_model,
    car_color: req.body.car_color,
    license_number: req.body.license_number,
  };
  // Insert new User
  knex("User")
    .insert({
      email: inputs.email,
      password: inputs.password,
      firstname: inputs.firstname,
      lastname: inputs.lastname,
      car_make: inputs.car_make,
      car_model: inputs.car_model,
      car_color: inputs.car_color,
      license_number: inputs.license_number,
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
      // res.status(500).json(err);
    });
});

// Activate Listener
const httpService = app.listen(port, () =>
  console.log("Listening Active, Server Operational")
);
console.log("Starting development server at http://localhost:" + port);
peerLink(httpService);

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
