import { Listener, OrderCreateEvent, Subject } from "@rpateltickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class OrderCreatedListener extends Listener<OrderCreateEvent> {
    subject: Subject.OrderCreated = Subject.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreateEvent['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        });

        
        await order.save();

        msg.ack();

    }

};  