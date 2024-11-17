import express from "express";
import { signinInput } from "../zod";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userRoutes = express();
const prisma = new PrismaClient();
userRoutes.use(express.json());


const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

const rsaPublicKey = process.env.RSA_PUBLIC_KEY || ""; 
const rsaPrivateKey = process.env.RSA_PRIVATE_KEY || ""; 

function encryptOtp(otp: string, aesKey: Buffer, iv: Buffer): string {
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encrypted = cipher.update(otp, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptOtp(encryptedOtp: string, aesKey: Buffer, iv: Buffer): string {
  const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
  let decrypted = decipher.update(encryptedOtp, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


function encryptAESKeyWithRSA(aesKey: Buffer): Buffer {
  return crypto.publicEncrypt(rsaPublicKey, aesKey);
}


function decryptAESKeyWithRSA(encryptedAESKey: Buffer): Buffer {
  return crypto.privateDecrypt(rsaPrivateKey, encryptedAESKey);
}


userRoutes.post("/signup", async (req: any, res: any) => {
  try {
    const { success } = signinInput.safeParse(req.body);
    if (!success) {
      res.status(411);
      return res.json({
        msg: "Invalid user Input",
      });
    }
    const existingUser = await prisma.user.findFirst({
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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
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
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      msg: "Error while Signing up",
    });
  }
});


userRoutes.post("/signin", async (req: any, res: any) => {
  try {
    const { success } = signinInput.safeParse(req.body);
    if (!success) {
      return res.status(411).json({ msg: "Invalid Inputs" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: req.body.username }, { email: req.body.email }],
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "Invalid User Access" });
    }

    const passwordValidation = await bcrypt.compare(req.body.password, user.password);
    if (!passwordValidation) {
      return res.status(403).json({ msg: "Incorrect Password" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const aesKey = crypto.randomBytes(32); 
    const iv = crypto.randomBytes(16); 


    const encryptedOtp = encryptOtp(otp, aesKey, iv);
    const encryptedAesKey = encryptAESKeyWithRSA(aesKey);

    await prisma.user.update({
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
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "Error while signing in" });
  }
});

userRoutes.post("/verify-otp", async (req: any, res: any) => {
  try {
    console.log("Session Data:", req.session.user); // Log the session data
    const {otp} = req.body;
    console.log("otp : "+otp);
    const username = req.session?.user?.data?.username;
    const email = req.session?.user?.data?.email;


    console.log("username & email : "+username, email);
    if(!username || !email){
      return res.status(400).json({error: "Username or email is missing"})
    }

    if(!otp){
      return res.status(400).json({error: "Otp is required"})
    }
    if (!username) {
      return res.status(400).json({ error: "Username is missing in session" });
    }    
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    console.log(user);
    
    console.log("user : "+JSON.stringify(user));
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

    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpires: null, iv: null, encryptedAesKey: null },
    });

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
    console.log(token);
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default userRoutes;