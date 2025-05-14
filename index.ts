import express from 'express'
import usersRouter from "./routes/users";
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/", usersRouter);

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

