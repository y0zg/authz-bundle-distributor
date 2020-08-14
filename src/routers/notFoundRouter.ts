import * as express from 'express';

const router = express.Router();

router.all('*', (_, res) => {
    res.status(404).send({ data: 'Not found' });
});

export default router;
