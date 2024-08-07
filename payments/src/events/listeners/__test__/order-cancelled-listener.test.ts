import { OrderCancelledEvent, OrderCreateEvent, OrderStatus } from "@rpateltickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/orders";
import { OrderCancelledListener } from "../order-cancelled-listener";


const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        userId: "123",
        price: 99
    });


    await order.save();


    const data:OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: "123"
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {listener, data, msg, order};

};


it('update the status of the order', async () => {
    const {listener, data, msg, order} = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);



    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acls the messages', async () => {
    const {listener, data, msg, order} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});