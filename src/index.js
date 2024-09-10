const express = require("express");
const app = express();
const db = require('../db/db');
const knex = require('knex');
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



app.get('/last-updatedEntry', async (req, res) => {
    try {
    const lastUpdatedEntry = await db('myFirstTable')
        .orderBy('updated_at', 'desc')
        .first();
    
    if (lastUpdatedEntry) {
    
        const localUpdatedAt = new Date(lastUpdatedEntry.updated_at).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' });
        lastUpdatedEntry.updated_at = localUpdatedAt;
        res.json(lastUpdatedEntry);
    } else {
        res.status(404).json({ message: 'No entries found' });
    }
    } catch (err) {
    console.error('Error retrieving last updated entry:', err);
    res.status(500).json({ message: 'Error with retrieving last updated entry' });
    } });


app.get("/entries", async(req, res)=>{
    try{
        const entries = await db("myFirstTable").select('*')
        res.json(entries);
    }catch(err){
        res.status(500).json({message: 'dowload data error'})
    }
})


app.post('/entries', async (req, res) => {
    const { name1, name2 } = req.body;
    try {
    const [id] = await db('myFirstTable').insert({ name1, name2 }).returning('id');
    res.status(201).json({ message: 'Data published', id });
    }catch(err){
    res.status(500).json({ message: 'error with publishing data' });
    }
});


app.delete('/entries', async (req, res)=>{
const {id} = req.body
try{
    const rowsDeleted = await db('myFirstTable').where({id}).del();
    if(rowsDeleted){
        res.json({message: `collumn with id: ${id} is deleted succesfully`})
    }else{
        res.status(404).json({mesage: `collumn you are trying to delete  with id: ${ id } dosent exist` })
    }
}catch(err){
    res.status(500).json({mesage: "There is problem with deleting data" })
}
})


app.put('/entries', async (req, res) => {
    const { id, name1, name2 } = req.body;
    
    try {
        
        const nowInLocal = new Date();
        const nowInUTC = new Date(nowInLocal.toLocaleString('en-US', { timeZone: 'Europe/Warsaw' })) 
    

    const result = await db('myFirstTable')
        .where({ id })
        .update({ name1, name2, updated_at: nowInUTC });
    
    if (result > 0) {
        res.json({ message: `Row with id: ${id} is updated successfully` });
    } else {
        res.status(404).json({ message: `Row you are trying to update with id: ${id} doesn't exist` });
    }
    } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).json({ message: 'There is a problem with updating data' });
    }
});


app.get('/last-updatedEntry', async (req, res) => {
    try {
const lastUpdatedEntry = await db('myFirstTable')
        .orderBy('updated_at', 'desc') 
        .first(); 
if (lastUpdatedEntry) {
        res.json(lastUpdatedEntry); 
} else {
        res.status(404).json({ message: 'No entries found' }); 
}
    } catch (err) {
console.error('Error retrieving last updated entry:', err);
res.status(500).json({ message: 'Error with retrieving last updated entry' });
    }
});


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
