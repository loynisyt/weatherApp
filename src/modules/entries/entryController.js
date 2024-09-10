const express = require('express');
const router = express.Router();
const entryService = require('./entryService');


router.get('/', async (req, res) => {
    try {
        const entries = await entryService.getAllEntries();
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: 'Error downloading data' });
    }
});


router.get('/lastid', async (req, res) => {
    try {
        const lastEntry = await entryService.getLastEntryById();
        if (lastEntry) {
            res.json(lastEntry);
        } else {
            res.status(404).json({ message: 'No entries found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving last updated entry' });
    }
});


router.post('/', async (req, res) => {
    const { name1, name2 } = req.body;
    try {
        const id = await entryService.createEntry(name1, name2);
        res.status(201).json({ message: 'Data published', id });
    } catch (err) {
        res.status(500).json({ message: 'Error with publishing data' });
    }
});


router.delete('/', async (req, res) => {
    const { id } = req.body;
    try {
        const rowsDeleted = await entryService.deleteEntry(id);
        if (rowsDeleted) {
            res.json({ message: `Entry with id: ${id} deleted successfully` });
        } else {
            res.status(404).json({ message: `Entry with id: ${id} does not exist` });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting data' });
    }
});


router.put('/', async (req, res) => {
    const { id, name1, name2 } = req.body;
    try {
        const result = await entryService.updateEntry(id, name1, name2);
        if (result > 0) {
            res.json({ message: `Entry with id: ${id} updated successfully` });
        } else {
            res.status(404).json({ message: `Entry with id: ${id} does not exist` });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating data' });
    }
});


router.get('/', async (req, res) => {
    try {
        const lastUpdatedEntry = await entryService.getLastUpdatedEntry();
        if (lastUpdatedEntry) {
            res.json(lastUpdatedEntry);
        } else {
            res.status(404).json({ message: 'No entries found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving last updated entry' });
    }
});

module.exports = router;
