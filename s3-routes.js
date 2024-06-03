import express from 'express';
import { uploadImage, getObjectUrl, listObjects } from './s3.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// S3 endpoint for image uploading
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const result = await uploadImage(req.file);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// S3 endpoint to get a URL for a specific object
router.get('/get/:key', async (req, res) => {
    try {
        const result = await getObjectUrl(req.params.key);
        console.log(result)
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// S3 endpoint to list all items in the bucket
router.get('/list', async (req, res) => {
    try {
        const result = await listObjects();
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
