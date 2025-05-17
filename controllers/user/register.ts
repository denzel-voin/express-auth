import {Request, Response} from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
    console.log('Вызов register, тело:', req.body);
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            console.log('Нет имени или пароля');
            res.status(400).json({ error: "Заполните имя и пароль" });
            return;
        }

        console.log('Ищем пользователя с именем:', name);
        const existingUser = await prisma.user.findUnique({ where: { name } });
        console.log('Результат existingUser:', existingUser);

        if (existingUser) {
            console.log('Пользователь уже существует');
            res.status(400).json({ error: "Такой пользователь уже существует" });
            return;
        }

        console.log('Хешируем пароль');
        const hashedPassword = bcrypt.hashSync(password, 10);
        console.log('Хеш пароля:', hashedPassword);

        console.log('Создаем пользователя в БД');
        await prisma.user.create({
            data: {
                name,
                password: hashedPassword,
            },
        });
        console.log('Пользователь создан');

        res.status(200).send("Пользователь зарегистрирован!");
    } catch (error) {
        console.error('Ошибка в register:', error);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

