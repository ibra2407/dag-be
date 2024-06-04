import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';
import multer from 'multer';
import AWS from 'aws-sdk';

dotenv.config();

const s3 = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.BUCKET_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_KEY
    }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to upload an image to S3 bucket
const uploadImage = async (req, res) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        return { success: true };
    } catch (error) {
        return { success: false };
    }
};

// Function to generate a presigned URL for a specific object in the S3 bucket
const generatePresignedUrl = async (key) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Expires: 3600 // URL expires in 1 hour
    };

    try {
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return { success: true, url };
    } catch (error) {
        return { success: false };
    }
};

// Function to list all objects in the S3 bucket and return presigned URLs
const listObjects = async () => {
    const params = {
        Bucket: process.env.BUCKET_NAME
    };

    try {
        const command = new ListObjectsV2Command(params);
        const data = await s3.send(command);
        const keys = await Promise.all(data.Contents.map(async item => {
            const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: params.Bucket, Key: item.Key }), { expiresIn: 3600 });
            return { ...item, url };
        }));

        return { success: true, data: keys };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Function to delete an object from the S3 bucket
const deleteImage = async (key) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key
    };

    try {
        const command = new DeleteObjectCommand(params);
        const response = await s3.send(command); // Send the command and await the response
        return { success: true, response }; // Return success along with the response
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export { upload, uploadImage, generatePresignedUrl, listObjects, deleteImage };
