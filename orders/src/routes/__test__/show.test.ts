import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('retriving all the tickets for particular user', async ()=> {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20
    });
    await ticket.save();

    const user  = global.signin();
    const user2 = global.signin();
    // make a request to build an order with this ticket
    const response = await request(app).post('/api/orders').set('Cookie', user).send({ticketId: ticket.id}).expect(201);

    // make request to retrive the order
    const response2 = await request(app).get(`/api/orders/${response.body.id}`).set('Cookie', user).send().expect(200);

    // Unauthorized
    const response3 = await request(app).get(`/api/orders/${response.body.id}`).set('Cookie', user2).send().expect(401);

    const id = new mongoose.Types.ObjectId().toHexString();

    const response4 = await request(app).get(`/api/orders/${id}`).set('Cookie', user).send().expect(404);


    expect(response.body.id).toEqual(response2.body.id);
});


it('returns 404 error when ticket is not found in database', async ()=> {
    // Create a ticket

    const user  = global.signin();

    const id = new mongoose.Types.ObjectId().toHexString();

    const response4 = await request(app).get(`/api/orders/${id}`).set('Cookie', user).send().expect(404);

});

it('returns 401 error for unauthorized user', async ()=> {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20
    });
    await ticket.save();

    const user  = global.signin();
    const user2 = global.signin();
    // make a request to build an order with this ticket
    const response = await request(app).post('/api/orders').set('Cookie', user).send({ticketId: ticket.id}).expect(201);

    // Unauthorized
    await request(app).get(`/api/orders/${response.body.id}`).set('Cookie', user2).send().expect(401);
});