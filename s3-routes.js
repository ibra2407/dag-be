import express from 'express';
import { upload, uploadImage, generatePresignedUrl, listObjects, deleteImage } from './s3.js';

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
    console.log(req.body)
    console.log(req.params)
    console.log(req.params.key)
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

// Route to delete an object from the S3 bucket
router.delete('/delete/:key', async (req, res) => {
    console.log(req.body)
    console.log(req.params)
    console.log(req.params.key)
    const response = await deleteImage(req.params.key);
    if (response.success) {
        res.json(response);
    } else {
        res.status(500).json(response);
    }
});

export default router;
