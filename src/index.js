const express = require('express');
const app = express();
const entryController = require('./modules/entries/entryController');
app.use(express.json());
app.use('/entries', entryController);
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
