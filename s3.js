import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const s3 = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.BUCKET_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_KEY
    }
});

const uploadImage = async (file) => {
    const name = file.originalname.split('.').slice(0, -1).join('.');
    const extension = file.originalname.split('.').pop();
    const key = `images/${uuidv4()}-${name}.${extension}`;

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        await s3.send(new PutObjectCommand(params));
        const url = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;
        return { success: true, url };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getObjectUrl = async (key) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `images/${key}`
    };

    try {
        const url = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${params.Key}`;
        return { success: true, url };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const listObjects = async () => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Prefix: 'images/'
    };

    try {
        const data = await s3.send(new ListObjectsV2Command(params));
        const keys = data.Contents.map(item => item.Key);
        return { success: true, keys };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export {
    uploadImage,
    getObjectUrl,
    listObjects
};
