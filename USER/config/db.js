const mysql = require('mysql');
require('dotenv').config();

const connectDB = mysql.createConnection({
    host: process.env.HOST,
    user: 'USERDB@dmsuserdb',
    password: process.env.PASSWORD,
    database: process.env.DB,
    ssl: true
});

connectDB.connect((err) => {
    if(err) {
        console.error('error connecting: ' + err.stack);
        return
    }
    console.log('DB connected...');
})
setInterval(function () {
    connectDB.query('SELECT 1');
}, 3000);
module.exports = connectDB;