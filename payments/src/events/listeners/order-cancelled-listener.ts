import { OrderCancelledEvent, Subject, Listener, OrderStatus } from "@rpateltickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/orders";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subject.OrderCancelled = Subject.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version-1
        }); // could use findById


        if(!order) {
            throw new Error('Order not found');
        }


        order.set({
            status: OrderStatus.Cancelled
        });

        await order.save();

        msg.ack();
    }

}