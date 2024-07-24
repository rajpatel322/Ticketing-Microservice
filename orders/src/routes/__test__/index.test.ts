import request from 'supertest';
import { app } from '../../app';

import { Ticket } from '../../models/ticket';


const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20
    });
    await ticket.save();

    return ticket;
}

it('fetches orders for an particular user', async ()=> {
    
    
    // Create three tickets
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    // Create one order as User #1
    await request(app).post('/api/orders').set('Cookie', userOne).send({ticketId: ticketOne.id});
    


    // Create two orders as User #2
    const ticketResponseOne = await request(app).post('/api/orders').set('Cookie', userTwo).send({ticketId: ticketTwo.id});
    const ticketResponseTwo = await request(app).post('/api/orders').set('Cookie', userTwo).send({ticketId: ticketThree.id});

    // Make request to get orders for User #2
    const response = await request(app).get('/api/orders').set('Cookie', userTwo);

    expect(response.status).toEqual(200);
    console.log(response.body);
    expect(response.body.length).toEqual(2);

    // checking if the get order return us the same ticket as we put it
    expect(ticketResponseOne.body.id).toEqual(response.body[0].id); 
    expect(ticketResponseTwo.body.id).toEqual(response.body[1].id);

    expect(ticketResponseOne.body.ticketId).toEqual(response.body[0].ticketId); 
    expect(ticketResponseTwo.body.ticketId).toEqual(response.body[1].ticketId);

});