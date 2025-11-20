// import sqlite3 from 'sqlite3'
// import { open } from 'sqlite'
// import path from 'node:path'

// async function createTable() {
// const db = await open({
//       filename : path.join('database.db'),
//       driver : sqlite3.Database
// });

// await db.exec(
//       `CREATE TABLE IF NOT EXISTS products (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             title TEXT NOT NULL,
//             artist TEXT NOT NULL,
//             price REAL NOT NULL,
//             image TEXT NOT NULL,
//             year INTEGER,
//             genre TEXT,
//             stock INTEGER
//       )`
// )

// console.log('Table created!')


// try {
//       const products = await db.all('SELECT * FROM products')
//       console.table(products)
// }
// catch (error) {
//       console.log(`Error fetching products: ${error.message}`)
// }
// finally {
//       await db.close()
// }

// }

// createTable()