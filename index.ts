import express from 'express';
import usersRouter from './routes/users';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/', usersRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Глобальная ошибка:', err);
    if (!res.headersSent) {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
