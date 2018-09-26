var mysql = require('mysql');

// Connection configurations.
const lampa_db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lampa'
});

// Connect to database.
lampa_db.connect();
