// ----------------------------------------------------------------------------------------- //

// import validator from 'validator'

// export async function registerUser(req, res) {

//   let { name, email, username, password } = req.body

//   if (name && email && username && password) {
//     name = name.trim()
//     email = email.trim()
//     username = username.trim()
//     password = password.trim()

//     const pattern = /^[a-zA-Z0-9_-]{1,20}$/
//     if (!pattern.test(username)) {
//       return res.status(422).json({error: 'Username must be between 1 and 20 characters and contain only letters, numbers, hyphens, and underscores.'})

//     }

//     if (!validator.isEmail(email)) {
//       return res.status(422).json({error: 'Invalid email format.'})

//     }
    
//     const userInfo = {'name': name,
//                'email': email,
//                'username': username,
//                'password': password}
//     console.log('User registered successfully:',userInfo)
    
//     return res.status(201).json({message: 'User registered successfully.'})
//   }
//   else {
//     return res.status(400).json({error: 'All fields are required'})
//   }
// }

// ----------------------------------------------------------------------------------------- //



import validator from 'validator'
import { getDBConnection } from '../db/db.js'

export async function registerUser(req, res) {

  let { name, email, username, password } = req.body

  if (!name || !email || !username || !password) {

    return res.status(400).json({ error: 'All fields are required.' })

  }

  name = name.trim()
  email = email.trim()
  username = username.trim()

  if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {

    return res.status(400).json(
      { error: 'Username must be 1–20 characters, using letters, numbers, _ or -.' }
    )
  }

  if (!validator.isEmail(email)) {

    return res.status(400).json({ error: 'Invalid email format' })

  }


  try {

    const db = await getDBConnection()
    
    const searchUserQuery = `SELECT * FROM users WHERE email = ? OR username = ?;`
    const searchParams = [email, username]

    const response = await db.all(searchUserQuery, searchParams)
    
    //  const existing = await db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username])

    if(response.length > 0) {
      return res.status(409).json({ error: 'Email or username already in use' })
    }
    else {
      const addUserQuery = `INSERT INTO users (name, email, username, password) 
                            VALUES (?, ?, ?, ?)`
      const userParams = [name, email, username, password]

      await db.run(addUserQuery, userParams)
    
      // const result = await db.run('INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)', [name, email, username, password])

      return res.status(201).json({message: 'User registered successfully.'})
    }
/*
Challenge:
1. Check if the username or email address has already been used.
    - If it has, end the response with a suitable status code and this object:
      { error: 'Email or username already in use.' }.

    - If the username and email address are unique in the database, add the user to the table and send this JSON { message: 'User registered'}. Which status code should you use?

- When you have been successful, the mini browser will redirect to the homepage.

- Run logTable.js to check you have created a user. 

- You will be able to see the password in the db! We will fix that later!
*/

  } catch (err) {

    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' })

  }


}