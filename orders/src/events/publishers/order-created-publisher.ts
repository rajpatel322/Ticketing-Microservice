import {Publisher, OrderCreateEvent, Subject} from '@rpateltickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreateEvent> {
    subject: Subject.OrderCreated = Subject.OrderCreated;
    
}

