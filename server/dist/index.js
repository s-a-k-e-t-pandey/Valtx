"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}));
const sessionMiddleware = (0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 100 * 60 * 60 * 24,
        sameSite: "lax"
    }
});
app.use(sessionMiddleware);
app.use("/api/v1/user", userRoutes_1.default);
app.use("/api/v1/file", fileRoutes_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
