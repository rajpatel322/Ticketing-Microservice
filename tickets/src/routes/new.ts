import express, {NextFunction, Request, Response} from 'express';
import { BadRequestError, requireAuth, validationRequest } from '@rpateltickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const createTicketRouter = express.Router();

createTicketRouter.post('/api/tickets', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero')
], validationRequest, async (req: Request, res: Response, next: NextFunction) => {
    const {title, price} = req.body;

    if(price > 999999.99) {
        throw new BadRequestError('Price must not exceed $999,999.99');
    }

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });

    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title, // want to use ticket.title instead of title variable since mongoose configure the the string according to it's way
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })

    res.status(201).send(ticket);
});

export default createTicketRouter