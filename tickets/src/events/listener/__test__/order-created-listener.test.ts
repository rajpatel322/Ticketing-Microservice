import { OrderCreateEvent, OrderStatus } from "@rpateltickets/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose, { set } from "mongoose";


const setup = async () => {

    const listener = new OrderCreatedListener(natsWrapper.client);


    const ticket = Ticket.build({
        title: 'concet',
        price: 99,
        userId: '1adsasd'
    });

    await ticket.save();

    const data: OrderCreateEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: 'asdasd',
        status: OrderStatus.Created,
        expiresAt: 'asdasda',
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
    }
    };

    // @ts-ignore
    const msg: message = {
        ack: jest.fn()
    };

    return {listener, ticket, data, msg};
};


it('sets the userId of the ticket', async () => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket  = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async ()=> {
    const {listener, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // @ts-ignore
    const ticketUpdatedData = (JSON.parse(natsWrapper.client.publish.mock.calls[0][1])); 

    expect(data.id).toEqual(ticketUpdatedData.orderId);
});