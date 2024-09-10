const db = require('../../../db/db');

const getAllEntries = async () => {
    return await db("myFirstTable").select('*');
};

const getLastEntryById = async () => {
    return await db('myFirstTable')
        .orderBy('id', 'desc')
        .first();
};

const createEntry = async (name1, name2) => {
    const [id] = await db('myFirstTable').insert({ name1, name2 }).returning('id');
    return id;
};

const deleteEntry = async (id) => {
    return await db('myFirstTable').where({ id }).del();
};

const updateEntry = async (id, name1, name2) => {
    const nowInLocal = new Date();
    const nowInUTC = new Date(nowInLocal.toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }));
    return await db('myFirstTable').where({ id }).update({ name1, name2, updated_at: nowInUTC });
};

const getLastUpdatedEntry = async () => {
    return await db('myFirstTable')
        .orderBy('updated_at', 'desc')
        .first();
};

module.exports = {
    getAllEntries,
    getLastEntryById,
    createEntry,
    deleteEntry,
    updateEntry,
    getLastUpdatedEntry,
};
