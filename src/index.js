const express = require('express');
const entryController = require('./modules/entries/entryController');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use('/entries', entryController);


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
