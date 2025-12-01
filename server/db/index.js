
const dotenv = require('dotenv');
dotenv.config();

let db;
if (process.env.DB_TYPE === 'mongodb') {
    db = require('./mongodb/index');
} else {
    db = require('./postgresql/index');
}

module.exports = db

