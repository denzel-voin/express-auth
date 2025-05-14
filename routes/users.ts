import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { users } from "../data";
import jsonwebtoken from 'jsonwebtoken';
import authMiddleware from "../middleware/authMiddleware";

const usersRouter = Router();

usersRouter.post("/register", (req: Request, res: Response): void => {
    const { name, password } = req.body;

    if (!name || !password) {
        res.status(400).json({ error: "Заполните имя и пароль" });
        return
    }

    if (users.some(user => user.name === name)) {
        res.status(400).json({ error: "Такой пользователь уже существует" });
        return
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    users.push({ name, password: hashedPassword });
    res.status(200).send("Пользователь зарегистрирован!");
});

usersRouter.post("/login", (req: Request, res: Response): void => {
    const { name, password } = req.body;

    if (!name || !password) {
        res.status(400).json({ error: "Заполните имя и пароль" });
        return;
    }

    const user = users.find(user => user.name === name);

    if (!user) {
        res.status(400).json({ error: "Такого пользователя не существует" });
        return;
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
        res.status(400).json({ error: "Неверный пароль" });
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
});

usersRouter.get('/profile', authMiddleware, (req: Request, res: Response): void => {
    res.status(200).json({message: users})
})

export default usersRouter;
