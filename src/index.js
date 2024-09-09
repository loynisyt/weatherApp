const express = require("express");
const app = express();
const db = require('./db/db');
app.use(express.json());
/*
const pg = require("pg");
const { Client } = pg;
const client = new Client({
  user: "kuba",
  password: "kuba2024",
  host: "localhost",
  port: 5435,
  database: "nauka",
});
*/




const database = [{
    name: "batman",
}, ];

const port = 3000;

function isAuthorizedMiddleware(req, res, next) {
    if (req.headers.authorization !== "Bearer 1234") {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }
    next();
}
// app.use(isAuthorizedMiddleware);



app.get('/last-entry', async (req, res) => {

    try {
        const lastEntry = await db('myFirstTable').orderBy('id', 'desc').first();



        if (lastEntry) {
            res.json({
                success: true,
                data: lastEntry
            })

        } else          {
            res.status(404).json({
                succes: false,
                message: 'brak wpisow w tabeli'
            });
                        }
    } catch (err) {
        console.error("blad podczas pobierania  danych")
        res.status(500).json({
            success: false,
            message: 'blad podczas pobierania danych'
                            })
    }

})




app.get("/movie", (req, res) => {
    res.send(database);
});



app.get("/test", async (req, res) => {
    await client.connect();



    const dbres = await client.query("SELECT $1::text as message", [
        "Hello world!",
    ]);
    console.log(dbres.rows[0].message); // Hello world!
    await client.end();
    res.send({
        message: "Hello world!"
    });
});



app.post("/movie", (req, res) => {
    database.push({
        name: req.query.name || req.body.name
    });
    res.send(database);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});