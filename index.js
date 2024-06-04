import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// imports all routes.js functions as routes.js returns router object
import users from './db-routes.js';
import s3Routes from './s3-routes.js'; // Import the S3 routes

// takes in secret keys from .env file
dotenv.config();

const app = express();

// define backend localhost port
const PORT = process.env.PORT || 8000;

app.use(express.json());  // to parse the incoming request with JSON payloads

// frontend localhost
const corsOptions = {
    origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// when running backend on localhost, will talk to api "localhost:8000/api/users", where users is the database table name
app.use('/db', users);

// Use the S3 routes
app.use('/s3', s3Routes);

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
});
