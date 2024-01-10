
// create a generic function to execute queries and return the results in a promise (so we can use async/await) 
// and then use it in the routes instead of the code above (which is repeated for each route) 

import mysql from 'mysql';
import { MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_USER } from './config.js';
let pool;

try {
    pool = mysql.createPool({
        connectionLimit: 10,
        host: MYSQL_HOST,
        database: MYSQL_DATABASE,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD
    });
    console.log("Connection Success")
}
catch (error) {
    console.log("SQL Error", error)
}

export function executeQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log("Error", err);
                if (connection) connection.release();
                reject(err);
                return;
            }

            connection.query(sql, params, (err, results) => {
                if (err) {
                    console.log("Error", err);
                    reject(err);
                } else {
                    resolve(results);
                }
                connection.release();
            });
        });
    });
}


export { pool };