import request  from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/orders";
import { OrderStatus } from "@rpateltickets/common";


it('marks an order as cancelled', async () => {
    // Create a ticket with ticket Model
    const ticket = Ticket.build({
        title: 'Concet',
        price: 20
    });

    await ticket.save();

    const user = global.signin();

    // make a request to create an order
    const response = await request(app).post('/api/orders').set('Cookie', user).send({ticketId: ticket.id}).expect(201);


    // make a request to cancel an order
    await request(app).delete(`/api/orders/${response.body.id}`).set('Cookie', user).send().expect(204);

    // looking up the order to make sure that it's cancelled
    const updatedOrder = await Order.findById(response.body.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emits o order cancelled event');