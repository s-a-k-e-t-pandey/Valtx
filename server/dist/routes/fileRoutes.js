"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fileRoutes = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
fileRoutes.use(express_1.default.json());
// Multer setup for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// File routes
fileRoutes.post('/upload', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const { userId } = req.body;
    const file = yield prisma.file.create({
        data: {
            filename: req.file.filename,
            path: req.file.path,
            userId: parseInt(userId),
        },
    });
    res.json(file);
}));
fileRoutes.get('files/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    const files = yield prisma.file.findMany({ where: { userId } });
    res.json(files);
}));
exports.default = fileRoutes;
