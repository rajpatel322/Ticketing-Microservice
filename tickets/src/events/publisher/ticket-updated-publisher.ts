import {Publisher, Subject, TicketUpdatedEvent} from '@rpateltickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subject.TicketUpdated;
}