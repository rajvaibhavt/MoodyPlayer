require('dotenv').config();
const app = require('./src/app');
const connectDb = require('./src/db/db');
const PORT = process.env.PORT || 3000;

connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to DB. Server not started.', err);
        process.exit(1);
    });