import mongoose, { mongo } from "mongoose";

// Attributes required to create a new Ticket
interface TicketAttrs {
    title: string,
    price: number,
    userId: string
}

// Properties that a Ticket document has
interface TicketDoc extends mongoose.Document {
    title: string,
    price: number,
    userId: string
}

// Interface to define custom methods on the Ticket model
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        } 
    }
});

// Adding a custom method to the schema to create a new Ticket
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
