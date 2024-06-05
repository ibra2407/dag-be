import express from 'express'
import { createOrUpdate, deleteUserById, getUserById, readAllUsers } from './db.js'

const router = express.Router()

// READ ALL Users
router.get('/users', async(req, res) => {
    const { success, data } = await readAllUsers()

    if(success){
        return res.json({success, data})
    }
    return res.status(500).json({success:false, messsage: "DB Error in reading all users"})
})

// Get a specific user by ID
router.get('/users/:id', async(req, res) => {
    const { id } = req.params
    const { success, data } = await getUserById(id)
    // console.log(data)
    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: false, message: "DB Error in getting user by id"})
})


// Create a new user in the database
router.post('/users', async(req, res) => {
    const userID = req.body.id;
    const userData = {...req.body, id: userID};
    const { success, data } = await createOrUpdate(userData)

    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: false, message: 'DB Error in creating new user'})
})


// Update a user's details by ID
router.put('/users/:id', async(req, res) => {
    const users = req.body
    const { id } = req.params
    users.id = id

    const { success, data } = await createOrUpdate(users)

    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: false, message: "DB Error in updating user by id"})
})


// Delete User by Id
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params
    const { success, data } = await deleteUserById(id)
    if (success) {
      return res.json({ success, data })
    }
    return res.status(500).json({ success: false, message: 'DB Error in deleting user by id'})
})

export default router