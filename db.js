import AWS from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config();

AWS.config.update({
    region: "ap-southeast-1",
    accessKeyId: process.env.DB_ACCESS_KEY,
    secretAccessKey: process.env.DB_SECRET_ACCESS_KEY
})

// dynamo db object instance
const DyDB = new AWS.DynamoDB.DocumentClient()

const Table = 'users'

// Create or Update users
const createOrUpdate = async (data = {}) =>{
    const params = {
        TableName: Table,
        Item: data
    }

    try{
        await DyDB.put(params).promise()
        return { success: true }
    } catch(error){
        return { success: false}
    }
}

// Read all user entries
const readAllUsers = async()=>{
    const params = {
        TableName: Table
    }

    try{
        const { Items = [] } = await DyDB.scan(params).promise()
        return { success: true, data: Items }

    } catch(error){
        return { success: false, data: null }
    }

}

// Read users by id
const getUserById = async (value, key = 'id') => {
    const params = {
        TableName: Table,
        Key: {
            [key]: value
        }
    }
    try {
        const { Item = {} } =  await DyDB.get(params).promise()
        return { success: true, data: Item }
    } catch (error) {
        return {  success: false, data: null}        
    }
}

// Delete Record by id
const deleteUserById = async(value, key = 'id' ) => { 
    const params = {
        TableName: Table,
        Key: {
            [key]: value
        }
    }
        
    try {
        await DyDB.delete(params).promise()
        return {  success: true }

    } catch (error) {
        return{ success: false }
    }
}


export {
    createOrUpdate,
    readAllUsers,
    getUserById,
    deleteUserById
}