const express = require('express');
const entryController = require('./modules/entries/entryController');
const userController = require('./modules/users/userController');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use('/entries', entryController);

app.use('/users', userController);


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
