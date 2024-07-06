import express, {NextFunction, Request, Response} from 'express';
import { requireAuth } from '@rpateltickets/common';


const createTicketRouter = express.Router();

createTicketRouter.post('/api/tickets', requireAuth, (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(200);
});

export default createTicketRouter