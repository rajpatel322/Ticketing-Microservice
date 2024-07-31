import { Message } from "node-nats-streaming";
import {Subject, Listener, TicketCreatedEvent} from '@rpateltickets/common';
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subject.TicketCreated = Subject.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const {id, title, price} = data;

        const ticket = Ticket.build({
            id: id,
            title:title,
            price:price
        });

        await ticket.save();

        msg.ack();
    }
    
}