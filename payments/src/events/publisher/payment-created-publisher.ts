import { PaymentCreatedEvent, Subject, Publisher } from "@rpateltickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subject.PaymentCreated = Subject.PaymentCreated;
    
}