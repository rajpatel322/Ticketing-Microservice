import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import { requireAuth, validationRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@rpateltickets/common';
import { Order } from '../models/orders';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();


router.post('/api/payments', requireAuth, [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
], validationRequest,
    async (req: Request, res: Response) => {
        const {token, orderId} = req.body;

        const order = await Order.findById(orderId);

        if(!order) {
            throw new NotFoundError();
        }

        if(order.userId !== req.currentUser!.id)  {
            throw new NotAuthorizedError();
        }

        if(order.status === OrderStatus.Cancelled) {
            throw new BadRequestError("Cannot pay for an cancelled order");
        }

        const paymentIntent = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token
        });
        

        const payment = Payment.build({
            orderId: orderId,
            stripId: paymentIntent.id,
        });

        await payment.save();
        
        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripId: payment.stripId,
            version: payment.version
        })

        res.status(201).send({id: payment.id});

    });


export {router as createChargeRouter};