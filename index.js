import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import multer from 'multer';

// imports all routes.js functions as routes.js returns router object
import users from './routes.js';

// import AWS SDK v3 modules for S3 and presigned URL generation
import { S3Client, GetObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const s3 = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.BUCKET_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_KEY
    }
});

// S3 endpoint for image uploading
app.post('/api/upload', upload.single('image'), (req, res) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `images/${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    s3.upload(params, (error, data) => {
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        return res.json({ success: true, data });
    });
});

// S3 endpoint to generate presigned URL for a specific object
app.get('/api/get/:key', async (req, res) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: req.params.key
    };

    try {
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        return res.json({ success: true, url });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// when running backend on localhost, will talk to api "localhost:8000/api/users", where users is the database table name
app.use('/api', users);

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
});
