import { getDBConnection } from  '../db/db.js'


export async function cartController(req, res) {
  const db = await getDBConnection()

  const userId = req.session.userId

  const productId = parseInt(req.body.productId, 10)

  if (!productId) {
    console.log('Error in fetching productId from frontend')
    return res.status(500).json({ error: 'Could not get product id' })
  }
  
  const isBought = await db.get(`SELECT * FROM cart_items WHERE product_id = ? AND user_id = ?`,[productId,userId])

  if (isBought) {
    await db.run(`UPDATE cart_items
                  SET quantity = quantity + 1
                  WHERE product_id = ? AND user_id = ?`,[productId, userId])
  }
  else {
    await db.run(`INSERT INTO cart_items (user_id, product_id)
                  VALUES (?, ?)`,[userId, productId])
  }
  res.json({ message: 'Added to cart' })
}

export async function getCartCount(req, res) {
  const db = await getDBConnection();
  
  const userId = req.session.userId

  const productCount = await db.get(`SELECT SUM(quantity) AS sum FROM cart_items WHERE user_id = ?`,[userId])

  res.json({totalItems: productCount.sum || 0})
}  


export async function getAll(req, res) {

// Don't touch this code!
  if (!req.session.userId) {
    return res.json({err: 'not logged in'})
  }

  const db = await getDBConnection()

//   const items = await db.all(`SELECT 
//                               c.product_id AS cartItemId, 
//                               sum(c.quantity) AS quantity, 
//                               p.title,
//                               p.artist,
//                               p.price
//                               FROM
//                               cart_items c 
//                               INNER JOIN products p
//                               ON c.product_id = p.id
//                               GROUP BY product_id
// `)
  // const data = {items: items}
  // console.log(data)
  res.json({items:items})

} 
