import express from 'express'
import { createOrUpdate, deleteUserById, getUserById, readAllUsers } from './db.js'

const router = express.Router()

// READ ALL Users
router.get('/users', async(req, res) => {
    const { success, data } = await readAllUsers()

    if(success){
        return res.json({success, data})
    }
    return res.status(500).json({success:false, messsage: "Error"})
})

// Get a specific user by ID
router.get('/users/:id', async(req, res) => {
    const { id } = req.params
    const { success, data } = await getUserById(id)
    // console.log(data)
    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: false, message: "Error"})
})


// Create a new user in the database
router.post('/users', async(req, res) => {
    const userID = parseInt(req.body.id);
    const userData = {...req.body, id: userID};
    const { success, data } = await createOrUpdate(userData)

    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: false, message: 'Error'})
})


// Update a user's details by ID
router.put('/users/:id', async(req, res) => {
    const users = req.body
    const { id } = req.params
    users.id = parseInt(id)

    const { success, data } = await createOrUpdate(users)

    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: false, message: "Error"})
})


// Delete User by Id
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params
    const { success, data } = await deleteUserById(id)
    if (success) {
      return res.json({ success, data })
    }
    return res.status(500).json({ success: false, message: 'Error'})
})


export default router