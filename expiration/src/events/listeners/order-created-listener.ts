import { Listener, OrderCreateEvent, OrderStatus, Subject} from "@rpateltickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreateEvent>{
    subject: Subject.OrderCreated = Subject.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreateEvent['data'], msg: Message) {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('waiting this milliseconds', delay);
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        });

        msg.ack();
    }

}