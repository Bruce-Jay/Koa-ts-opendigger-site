import mysql from 'mysql';

const options = {
    host: '3.26.95.228',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'users'
}

export const pool = mysql.createPool(options);

export const query = async (sql: string, values: any, callback: any) => {
    // const connection = await pool.getConnection();
    // if (!connection) return;
    
    // try {
    //     const [rows] = await connection.query(sql, values);
    //     return rows;
    // } finally {
    //     connection.release();
    // }
    pool.getConnection(function(err, connection) {
        connection.query(sql, values, function(err, rows) {
            callback(err, rows);
            connection.release();
        })
    });
}