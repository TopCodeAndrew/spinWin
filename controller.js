require("dotenv").config();
const Sequelize = require("sequelize");
const { CONNECTION_STRING, SERVER_PORT } = process.env;
// console.log(CONNECTION_STRING);

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});

let userArr = ["test"];

let todayDate = new Date().toISOString().slice(0, 10);

// console.log(todayDate);

module.exports = {
    submitSpin: async (req, res) => {
        let { iphone_id } = req.body;
        console.log(iphone_id);

        sequelize
            .query(
                `SELECT * FROM submissions WHERE user_id = ${iphone_id}AND submission_date = '${todayDate}T00:00:00Z'`
            )
            .then((dbRes) => {
                if (dbRes[0].length === 0) {
                    console.log("no record found", dbRes[0]);

                    sequelize
                        .query(
                            `
                    INSERT INTO submissions(submission_date, user_id)
                    VALUES ('${todayDate}', ${iphone_id}) RETURNING *`
                        )
                        .then((spinDbRes) => {
                            res.status(200).send(spinDbRes);
                        });
                } else {
                    console.log("already queried today", dbRes[0]);
                    res.status(400).send("you already queried today");
                }
            });

        // if (userArr.includes(iphone_id)) {
        //     console.log("included");
        //     res.status(404).send("you already made this request");
        // } else {
        //     console.log("not included");
        //     userArr.push(iphone_id);
        //     res.status(200).send("here is a payment");
        // }
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
	user_id serial PRIMARY KEY NOT NULL,
	iphone_id integer NOT NULL UNIQUE
);

CREATE TABLE submissions (
	submission_id serial PRIMARY KEY NOT NULL,
	user_id int NOT NULL REFERENCES users(user_id),
	submission_date DATE NOT NULL
);

INSERT INTO users(iphone_id)
VALUES (1);

INSERT INTO submissions(submission_date, user_id)
VALUES ('2000-12-31', 1);`
            )
            .then((dbRes) => res.status(200).send(dbRes));
    },
};
