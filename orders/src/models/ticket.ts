import mongoose, { mongo } from 'mongoose';
import { Order } from './orders';
import { OrderStatus } from '@rpateltickets/common';


interface TicketAttrs {
    title: string;
    price: number;
}




export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReserved() : Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const Ticketschema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    price: {
        type: Number,
        require: true,
        min: 0
    }
}, {
    toJSON: {
    transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
}});


Ticketschema.statics.build = (attrs:TicketAttrs) => {
    return new Ticket(attrs);
};

Ticketschema.methods.isReserved = async function() {
    // Run query to look at all the orders. Find an order where the ticket is the ticket we just found and the status is not cancelled
    const order = await Order.findOne({
        ticket :this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.Complete,
                OrderStatus.AwaitingPayment
            ]
        }
    });

    if(order) {
        return true;
    }
    return false;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', Ticketschema);

export { Ticket }