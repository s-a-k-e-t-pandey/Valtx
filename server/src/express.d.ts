import session from "express-session";

declare module 'express-session' {
    interface SessionData {
        user?: {
            username: any,
            email: any
        },
        views?: number;
    }
}