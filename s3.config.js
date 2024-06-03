import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command} from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.BUCKET_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_KEY
    }
});

export {s3};