const express = require('express')

const app = express()
app.use(express.json())

const database = [{
    name: "batman"
}]

const port = 3000

function isAuthorizedMiddleware(req, res, next) {
    if (req.headers.authorization !== 'Bearer 1234') {
        return res.status(401).send({ message: "Unauthorized" });
    }
    next();
}

app.use(isAuthorizedMiddleware);

app.get('/movie', (req, res) => {
    res.send(database)
})

app.post('/movie', (req, res) => {
    database.push({ name: req.query.name || req.body.name })
    res.send(database)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})