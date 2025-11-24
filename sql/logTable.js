// import { getDBConnection } from '../db/db.js'

// async function logTable() {
//   const db = await getDBConnection()

//   const tableName = 'users'

//   try { 

//     const table = await db.all(`SELECT * FROM ${tableName}`)
//     console.table(table)

//   } catch (err) {

//     console.error('Error fetching table:', err.message)

//   } finally {

//     await db.close()

//   }
// }

// logTable()

import { getDBConnection } from '../db/db.js'

// Define the maximum length for column entries
const MAX_COLUMN_LENGTH = 30 

async function logTable() {
  const db = await getDBConnection()

  const tableName = 'users'

  try {
    const table = await db.all(`SELECT * FROM ${tableName}`)

    // 1. Process the table data to truncate long entries
    const displayTable = table.map(row => {
      const newRow = {}
      for (const key in row) {
        let value = row[key]

        // Only process string values
        if (typeof value === 'string' && value.length > MAX_COLUMN_LENGTH) {
          // Truncate the string and add '...'
          newRow[key] = value.substring(0, MAX_COLUMN_LENGTH - 3) + '...'
        } else {
          newRow[key] = value
        }
      }
      return newRow
    })

    // 2. Log the processed table
    console.table(displayTable)

  } catch (err) {

    console.error('Error fetching table:', err.message)

  } finally {

    await db.close()

  }
}

logTable()