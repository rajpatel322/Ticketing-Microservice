import mongoose, { mongo } from 'mongoose';
import { OrderStatus } from '@rpateltickets/common';
import { TicketDoc } from './ticket';

// attributes
interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}


// properties that a order document has
interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    version: number
}

// interface to define custom methods on the Order model
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        deafult: OrderStatus.Created
    },expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket' // Foreign key
    }
}, {toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
}});

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order};

