import { Subject, Publisher, ExpirationCompleteEvent } from "@rpateltickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
}