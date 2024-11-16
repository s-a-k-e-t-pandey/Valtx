import express from "express";
import { PrismaClient } from "@prisma/client"
import multer from 'multer';
import path from 'path';


const fileRoutes = express();
const prisma = new PrismaClient();
fileRoutes.use(express.json());


// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// File routes
fileRoutes.post('/upload', upload.single('file'), async (req: any, res: any) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId } = req.body;
    const file = await prisma.file.create({
        data: {
            filename: req.file.filename,
            path: req.file.path,
            userId: parseInt(userId),
        },
    });

    res.json(file);
});

fileRoutes.get('files/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const files = await prisma.file.findMany({ where: { userId } });
    res.json(files);
});

export default fileRoutes;