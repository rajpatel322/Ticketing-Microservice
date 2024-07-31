import express, {Request, Response} from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validationRequest } from '@rpateltickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/orders';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15*60;

router.post('/api/orders', requireAuth, [
    body('ticketId').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage("TicketId must be provided")
], async (req: Request, res:Response) => {
    // Find the ticket the user is trying to order in the database
    const tickets = await Ticket.findById(req.body.ticketId);

    if(!tickets) {
        throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    
    const isReserved = await tickets.isReserved();
    if(isReserved) {
        throw new BadRequestError("Ticket is already reserved");
    }
    
    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds()+ EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: tickets

    })
    // Publish an event saying that an order was created

    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {id: tickets.id,
            price: tickets.price
        },
        version: order.version
    });

    await order.save();

    res.status(201).send(order);
});

export {router as newOrderRouter};