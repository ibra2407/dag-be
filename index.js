import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

// imports all routes.js functions as routes.js returns router object
import users from './routes.js';

// import AWS SDK v3 modules for S3 and presigned URL generation
import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command} from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        const name = file.originalname.split('.').slice(0, -1).join('.');
        const extension = file.originalname.split('.').pop();
        const key = `images/${uuidv4()}-${name}.${extension}`;
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        await s3.send(new PutObjectCommand(params));

        const url = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;
        return res.json({ success: true, url });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// S3 endpoint to get a presigned URL for a specific object
app.get('/api/get/:key', async (req, res) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `images/${req.params.key}`
    };

    try {
        const command = new GetObjectCommand(params);
        const url = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${params.Key}`;
        return res.json({ success: true, url });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// S3 endpoint to list all items in the bucket
app.get('/api/list', async (req, res) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Prefix: 'images/'
    };

    try {
        const data = await s3.send(new ListObjectsV2Command(params));
        console.log(data)
        const keys = data.Contents.map(item => item.Key);
        return res.json({ success: true, keys });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// when running backend on localhost, will talk to api "localhost:8000/api/users", where users is the database table name
app.use('/api', users);

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
});
