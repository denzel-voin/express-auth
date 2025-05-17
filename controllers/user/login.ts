import {Request, Response} from "express";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<void> => {
    const {name, password} = req.body;

    if (!name || !password) {
        res.status(400).json({error: "Заполните имя и пароль"});
        return;
    }

    const user = await prisma.user.findUnique({where: {name}});

    if (!user) {
        res.status(400).json({error: "Такого пользователя не существует"});
        return;
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
        res.status(400).json({error: "Неверный пароль"});
        return;
    }

    const token = jsonwebtoken.sign(
        {name: user.name},
        process.env.SECRET_KEY as string,
        {expiresIn: "1h"}
    );

    res.status(200).json({
        message: `Добрый день, ${user.name}!`,
        token,
    });
};