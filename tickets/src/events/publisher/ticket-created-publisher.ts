import { Publisher, Subject, TicketCreatedEvent } from "@rpateltickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject =  Subject.TicketCreated;
    
}