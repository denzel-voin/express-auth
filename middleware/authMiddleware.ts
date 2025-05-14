import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers)
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Нет токена" });
        return;
    }

    try {
        const user = jwt.verify(token, process.env.SECRET_KEY as string);
        (req as any).user = user;
        next();
    } catch (e) {
        res.status(403).json({ error: "Неверный токен" });
        return;
    }
};

export default authMiddleware;
