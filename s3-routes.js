import express from 'express';
import { upload, uploadImage, generatePresignedUrl, listObjects } from './s3.js';

const router = express.Router();

// Route to upload an image
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        await uploadImage(req, res);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to generate a presigned URL for a specific object
router.get('/get/:key', async (req, res) => {
    try {
        const response = await generatePresignedUrl(req.params.key);
        res.json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to list all objects in the S3 bucket
router.get('/list', async (req, res) => {
    try {
        const response = await listObjects();
        res.json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
