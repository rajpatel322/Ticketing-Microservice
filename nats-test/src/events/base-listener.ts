import { Message, Stan } from "node-nats-streaming";
import { Subject } from "./subjects";

interface Event {
    subject: Subject;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract onMessage(data: T['data'], msg:Message): any;
    abstract queueGroupName: string;
    protected ackwait = 5*1000;
    private client : Stan;


    constructor(client: Stan) {
        this.client = client;
    };


    subscriptionOptions() {
        return this.client.subscriptionOptions().setDeliverAllAvailable().setManualAckMode(true).setAckWait(this.ackwait).setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg:Message) => {
            console.log(`Message receieved: ${this.subject} / ${this.queueGroupName}`);

            const parsedData = this.parseMessage(msg);

            this.onMessage(parsedData, msg);
        });

    }

    parseMessage(msg:Message) {
        const data = msg.getData();
        return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf-8'));
    }


};

