import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import users from './db-routes.js';
import s3Routes from './s3-routes.js';

dotenv.config();

const app = express();

// Define backend localhost port
const PORT = process.env.PORT || 8000;

app.use(express.json());  // To parse the incoming request with JSON payloads

// Frontend localhost
const corsOptions = {
    origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Use the routes from db-routes.js and s3-routes.js
app.use('/api', users);
app.use('/api/s3', s3Routes);

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
});
