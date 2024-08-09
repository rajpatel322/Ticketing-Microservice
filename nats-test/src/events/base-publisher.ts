import { Stan } from "node-nats-streaming";
import { Subject } from "./subjects";
import { rejects } from "assert";

interface Event {
    subject: Subject;
    data: any;
}

export abstract class Publisher<T extends Event>{
    abstract subject: T['subject'];
    private server: Stan;

    constructor(server: Stan) {
        this.server = server;
    }

    publish(data: T['data']): Promise<void>{

        return new Promise((resolve, rejects) => {
            this.server.publish(this.subject, JSON.stringify(data), (err) => {
                if(err) {
                    return rejects(err);
                }
                resolve();
            });
        });
        
    }
};