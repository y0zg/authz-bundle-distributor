import { Request, Response, NextFunction } from 'express';

export const update = (_req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).send({});
    } catch (err) {
        next(err);
    }
};
