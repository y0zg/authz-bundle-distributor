import { Request, Response, NextFunction } from 'express';

export const create = (_req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(201).send({});
    } catch (err) {
        next(err);
    }
};
