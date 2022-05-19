// const { response } = require("express");
const express = require("express");

const app = express();
app.use(express.json());

let cntrl = require("./controller");

let { seed, submitSpin } = cntrl;

let userArr = [];

// const userController = require("./controllers/userController");

// const { CONNECTION_STRING, SERVER_PORT } = process.env;

// app.post("/seed", seed);

app.post("/seed", seed);
app.post("/spin", submitSpin);

app.listen(4444, () => console.log(`Running on port ${4444}`));
