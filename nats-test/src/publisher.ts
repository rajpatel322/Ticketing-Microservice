import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const client = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

client.on('connect', async () => {
    console.log("Publicher connected to NATS");

    const publisher = new TicketCreatedPublisher(client);
    try{
        await publisher.publish({
            id: '123',
            title: 'Test',
            price: 20
        });
    } catch (err) {
        console.error(err);
    }
        


});

