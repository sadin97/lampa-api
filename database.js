var mysql = require('mysql');

// Connection configurations.
const lampa_db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lampa'
});

/*

host: 'localhost',
user: 'root',
password: '',
database: 'lampa'

host: 'mysql678.loopia.se',
user: 'sadin@w240090',
password: 'lampa4444',
database: 'walter_ba_db_3'

*/

// Connect to database.
lampa_db.connect();

module.exports = lampa_db;
