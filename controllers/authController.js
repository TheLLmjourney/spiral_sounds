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
import bcrypt from 'bcryptjs'

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

    const hashedPassword = await bcrypt.hash(password, 10)

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
      const userParams = [name, email, username, hashedPassword]

      const result = await db.run(addUserQuery, userParams)

      req.session.userId = result.lastID
    
      // const result = await db.run('INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)', [name, email, username, password])

      return res.status(201).json({message: 'User registered successfully.'})
    }

  } catch (err) {

    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' })
  }
}




export async function loginUser(req, res) {

  try {
    const db = await getDBConnection()

    let { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    username = username.trim()

    const user = await db.get(`SELECT * FROM users WHERE username = ?`,[username])

    if (!user) {
      return res.status(401).json({ error: 'Invalid Credentials' })
    }
    
    const userExists = await bcrypt.compare(password, user.password)
    
    if (userExists) {
        req.session.userId = user.id
        return res.json({ message: 'Logged in'})
      }
    return res.status(401).json({ error: 'Invalid Credentials' })


  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ error: 'Login failed. Please try again.' })
  }
}

