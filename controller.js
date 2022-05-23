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

let todayDate = new Date().toISOString().slice(0, 10);

handleCreateSubmission = async (date, id) => {
    await sequelize
        .query(
            `
                    INSERT INTO submissions(submission_date, user_id)
                    VALUES ('${date}', ${id}) RETURNING *`
        )
        .then((spinDbRes) => {
            res.status(200).send(spinDbRes);
        });
};

module.exports = {
    submitSpin: async (req, res) => {
        let { iphone_id } = req.body;
        sequelize
            .query(
                `SELECT * FROM submissions WHERE user_id = ${iphone_id} AND submission_date = '${todayDate}T00:00:00Z'`
            )
            .then((dbRes) => {
                if (dbRes[0].length === 0) {
                    // IF NO SUBMISSION HAS BEEN MADE FOR THIS DAY, CREATE THE SUBMISSION
                    handleCreateSubmission(todayDate, iphone_id).catch(
                        (err) => {
                            console.log(err);
                        }
                    );
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
    seed: (req, res) => {
        sequelize
            .query(
                `CREATE TABLE users (
	user_id serial PRIMARY KEY NOT NULL,
	iphone_id integer NOT NULL UNIQUE,
  user_paypal_email varchar(100) NOT NULL UNIQUE
);

CREATE TABLE submissions (
	submission_id serial PRIMARY KEY NOT NULL,
	user_id int NOT NULL REFERENCES users(user_id),
	submission_date DATE NOT NULL
);

INSERT INTO users(iphone_id, user_paypal_email)
VALUES (1, 'tester@test.com');

INSERT INTO submissions(submission_date, user_id)
VALUES ('2000-12-31', 1);`
            )
            .then((dbRes) => res.status(200).send(dbRes));
    },
};
