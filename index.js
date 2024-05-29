import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import dotenv from 'dotenv'

// imports all routes.js functions as routes.js returns router object
import users from './routes.js'

// takes in secret keys from .env file
dotenv.config()

const app = express();

// define backend localhost
const PORT = process.env.PORT || 8000;

app.use(express.json());  // to parse the incoming request with JSON payloads

// frontend localhost
const corsOptions = {
    origin: "http://localhost:5173",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

// when running backend on localhost, will talk to api "localhost:8000/api/users", where users is the database table name
app.use('/api', users);


app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`)
});

// allows post requests *** what is /addApi? --not in use
// app.post("/api/addApi", (req, res) => {
//     res.status(200).send(req.body);
// });

// app.get("/api/appDetails/:id", (req, res) => {

//     const appDetails = {
//         appName: "App Name",
//         appLink: "App Link",
//         appDescription: "App Description"
//     };
//     console.log(req.params.id);
//     res.status(200).send(appDetails);
// });


