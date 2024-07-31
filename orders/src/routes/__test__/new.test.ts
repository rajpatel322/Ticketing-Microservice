import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
import { Order } from '../../models/orders';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@rpateltickets/common';

it('returns an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app).post('/api/orders').set('Cookie', global.signin()).send({ticketId}).expect(404);

}); 

it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20
    });

    await ticket.save();
    const order = Order.build({
        ticket: ticket,
        userId: 'asdadsasd',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });

    await order.save();

    await request(app).post('/api/orders').set('Cookie', global.signin()).send({ticketId: ticket.id}).expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20
    });

    await ticket.save();

    const cookie =  global.signin();

    await request(app).post('/api/orders').set('Cookie',cookie).send({ticketId: ticket.id}).expect(201);
    await request(app).post('/api/orders').set('Cookie', cookie).send({ticketId: ticket.id}).expect(400);

    
});

it('emits an order created event', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20
    });

    await ticket.save();

    const cookie =  global.signin();

    await request(app).post('/api/orders').set('Cookie',cookie).send({ticketId: ticket.id}).expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});