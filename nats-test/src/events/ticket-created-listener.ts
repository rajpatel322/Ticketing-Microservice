import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subject } from "./subjects";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subject.TicketCreated;
    queueGroupName = 'payment-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data', data);
        msg.ack();
    }
    
}
export default TicketCreatedListener;