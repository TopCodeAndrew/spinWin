require("dotenv").config();
const Sequelize = require("sequelize");
const { CONNECTION_STRING, SERVER_PORT } = process.env;
console.log(CONNECTION_STRING);

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});

let userArr = ["test"];

module.exports = {
    submitSpin: async (req, res) => {
        let { userId } = req.body;
        if (userArr.includes(userId)) {
            console.log("included");
            res.status(404).send("you already made this request");
        } else {
            console.log("not included");
            userArr.push(userId);
            res.status(200).send("here is a payment");
        }
    },
    addUserEmail: async (req, res) => {
        console.log(req.body);
        userArr.push(req.body);
        console.log(userArr);
        res.status(200).send("successfully added user email");
    },
    seed: (req, res) => {
        sequelize
            .query(
                `CREATE TABLE users (
	"user_id" serial PRIMARY KEY NOT NULL,
	"iPhone_id" integer NOT NULL UNIQUE
);

CREATE TABLE submissions (
	"submission_id" serial PRIMARY KEY NOT NULL,
	"user_id" int NOT NULL REFERENCES Users(user_id),
	"date" DATE NOT NULL
);`
            )
            .then((dbres) => res.status(200).send(dbres));
    },
};
