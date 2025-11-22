import { getDBConnection } from '../db/db.js'

export async function getProducts(req, res) {
  try {
    const db = await getDBConnection()
    
    const genreParam = req.query.genre

    let query = `SELECT * FROM products`
    let params = []

    if (genreParam) {
      query += ` WHERE genre = ?`
      params.push(genreParam)
    }

    const searchParam = req.query.search

    if (searchParam) {
      query += ` WHERE title LIKE ?
                    OR genre LIKE ?
                    OR artist LIKE ?`

      const searchPattern = `%${searchParam}%`
      
      params.push(searchPattern)
      params.push(searchPattern)
      params.push(searchPattern)
    }

    const products = await db.all(query, params)
    
    res.json(products)
    
  }
  catch (err) {
    res.json({error: 'Failed to fetch products', details: err.message})
  }
}


export async function getGenres(req, res) {
  try {
    const db = await getDBConnection()
    const genreRows = await db.all(`SELECT DISTINCT genre FROM products`)
    const genres = genreRows.map(row => row.genre)
    res.json(genres)
  }
  catch (err) {
    res.status(500).json({error: 'Failed to fetch genres', details: err.message})

  }
}


