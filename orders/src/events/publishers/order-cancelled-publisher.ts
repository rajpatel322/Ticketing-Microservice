import {Publisher, OrderCancelledEvent, Subject} from '@rpateltickets/common';


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subject.OrderCancelled = Subject.OrderCancelled;
}