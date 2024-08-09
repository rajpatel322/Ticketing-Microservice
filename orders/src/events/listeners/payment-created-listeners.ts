import { Subject, Listener, PaymentCreatedEvent } from "@rpateltickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { OrderStatus } from "@rpateltickets/common";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subject.PaymentCreated = Subject.PaymentCreated;
    async onMessage(data: PaymentCreatedEvent['data'] , msg: Message) {
        const order = await Order.findById(data.orderId);

        if(!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Complete
        });

        await order.save();

        msg.ack();

    }
    queueGroupName = queueGroupName;
    
}