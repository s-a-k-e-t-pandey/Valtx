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
const zod_1 = require("../zod");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const userRoutes = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
userRoutes.use(express_1.default.json());
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
const rsaPublicKey = process.env.RSA_PUBLIC_KEY || "";
const rsaPrivateKey = process.env.RSA_PRIVATE_KEY || "";
function encryptOtp(otp, aesKey, iv) {
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', aesKey, iv);
    let encrypted = cipher.update(otp, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
function decryptOtp(encryptedOtp, aesKey, iv) {
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', aesKey, iv);
    let decrypted = decipher.update(encryptedOtp, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
function encryptAESKeyWithRSA(aesKey) {
    return crypto_1.default.publicEncrypt(rsaPublicKey, aesKey);
}
function decryptAESKeyWithRSA(encryptedAESKey) {
    return crypto_1.default.privateDecrypt(rsaPrivateKey, encryptedAESKey);
}
userRoutes.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = zod_1.signinInput.safeParse(req.body);
        if (!success) {
            res.status(411);
            return res.json({
                msg: "Invalid user Input",
            });
        }
        const existingUser = yield prisma.user.findFirst({
            where: {
                email: req.body.email,
            },
        });
        if (existingUser) {
            res.status(409);
            return res.json({
                msg: "User Already exist",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        const user = yield prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            },
        });
        req.session.user = {
            username: user.username,
            email: user.email,
        };
        res.status(200);
        return res.json({
            signup: true,
            user: {
                email: user.email,
                username: user.username,
            },
        });
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({
            msg: "Error while Signing up",
        });
    }
}));
userRoutes.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = zod_1.signinInput.safeParse(req.body);
        if (!success) {
            return res.status(411).json({ msg: "Invalid Inputs" });
        }
        const user = yield prisma.user.findFirst({
            where: {
                OR: [{ username: req.body.username }, { email: req.body.email }],
            },
        });
        if (!user) {
            return res.status(404).json({ msg: "Invalid User Access" });
        }
        const passwordValidation = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!passwordValidation) {
            return res.status(403).json({ msg: "Incorrect Password" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const aesKey = crypto_1.default.randomBytes(32);
        const iv = crypto_1.default.randomBytes(16);
        const encryptedOtp = encryptOtp(otp, aesKey, iv);
        const encryptedAesKey = encryptAESKeyWithRSA(aesKey);
        yield prisma.user.update({
            where: { id: user.id },
            data: { otp: encryptedOtp, otpExpires: new Date(Date.now() + 10 * 60 * 1000), iv: iv.toString("hex"), encryptedAesKey: encryptedAesKey.toString("hex") },
        });
        req.session.user = { data: { username: user.username, email: user.email } };
        console.log(req.session.user);
        console.log(otp);
        return res.status(200).json({
            signin: true,
            user: { email: user.email, username: user.username, id: user.id },
            encryptedAesKey: encryptedAesKey.toString("base64"),
            iv: iv.toString("hex"), // Send IV for AES decryption
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ msg: "Error while signing in" });
    }
}));
userRoutes.post("/verify-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { otp } = req.body;
        console.log("otp : " + otp);
        const username = (_c = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.username;
        const email = (_f = (_e = (_d = req.session) === null || _d === void 0 ? void 0 : _d.user) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.email;
        console.log("username & email : " + username, email);
        if (!username || !email) {
            return res.status(400).json({ error: "Username or email is missing" });
        }
        if (!otp) {
            return res.status(400).json({ error: "Otp is required" });
        }
        if (!username) {
            return res.status(400).json({ error: "Username is missing in session" });
        }
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        console.log(user);
        console.log("user : " + JSON.stringify(user));
        console.log(user);
        console.log(JSON.stringify(user));
        if (!user || !user.otp || !user.otpExpires || !user.iv || !user.encryptedAesKey) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }
        const iv = Buffer.from(user.iv, 'hex');
        const encryptedAesKey = Buffer.from(user.encryptedAesKey, 'hex');
        const encryptedOtp = user.otp;
        const decryptedAesKey = decryptAESKeyWithRSA(encryptedAesKey);
        const decryptedOtp = decryptOtp(encryptedOtp, decryptedAesKey, iv);
        if (decryptedOtp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }
        yield prisma.user.update({
            where: { id: user.id },
            data: { otp: null, otpExpires: null, iv: null, encryptedAesKey: null },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
        console.log(token);
        return res.status(200).json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}));
exports.default = userRoutes;
