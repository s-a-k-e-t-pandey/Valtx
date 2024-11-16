import express from 'express';
import cors from 'cors';
import session from "express-session"
import userRoutes from './routes/userRoutes';
import fileRoutes from './routes/fileRoutes';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


app.use(cors({
    origin: ["http://localhost:5173"],
    methods:['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}))


const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 100 * 60 * 60 * 24,
        sameSite: "lax"
    }
})

app.use(sessionMiddleware);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/file", fileRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});