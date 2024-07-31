import { Listener, OrderCreateEvent, OrderStatus, Subject } from "@rpateltickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreateEvent>{
    subject: Subject.OrderCreated = Subject.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreateEvent['data'], msg: Message) {
        // Find the ticket that the order is erseving
        const ticket = await Ticket.findById(data.ticket.id);

        // If no ticket, throw error
        if(!ticket) {
            throw new Error('Ticket not found');
        }

        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({orderId: data.id});

        // save the ticket
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            version: ticket.version,
            userId: ticket.userId,
            orderId: ticket.orderId
        });

        msg.ack();
    }


}