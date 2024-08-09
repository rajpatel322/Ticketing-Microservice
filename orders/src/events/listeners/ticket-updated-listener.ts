import { Subject, Listener, TicketUpdatedEvent} from "@rpateltickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subject.TicketUpdated = Subject.TicketUpdated;

    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const {id, title, price} = data;
        const ticket = await Ticket.findByEvent(data);
        
        if(!ticket) {
            throw new Error('Ticket not found');
        }
        
        ticket.set({
            title: title,
            price: price
        });
        
        await ticket.save(); // this will call the update-if-current plug in to increment the version
        
        msg.ack();
    }
}
    
