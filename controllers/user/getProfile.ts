import {Request, Response} from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user;

    const fullUser = await prisma.user.findUnique({
        where: { name: user.name },
        select: { id: true, name: true }
    });

    res.status(200).json(fullUser);
};